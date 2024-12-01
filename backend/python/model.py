import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import requests
import time
import hashlib


API_URL_GAINS = "http://localhost:3000/api/gains"  
PREDICTIONS_URL = "http://localhost:3000/api/predictions"  

def create_sequences(data, seq_length=3):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i + seq_length])
        y.append(data[i + seq_length])
    return np.array(X), np.array(y)

def preprocess_data(data):
    # Ensure 'total' is numeric and handle missing values
    data['total'] = pd.to_numeric(data['total'], errors='coerce')
    data = data.dropna(subset=['total'])

    # Scale 'total' to range [0, 1]
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_scaled = scaler.fit_transform(data[['total']])

    # Adjust sequence length
    sequence_length = min(3, len(data))

    X, y = create_sequences(data_scaled, sequence_length)

    # Reshape X for LSTM input
    X = X.reshape(X.shape[0], X.shape[1], 1)

    return X, y, sequence_length, scaler, data_scaled
 
def train_model(X, y):
    # Split data into training and testing sets
    train_size = int(len(X) * 0.8)
    X_train, y_train = X[:train_size], y[:train_size]
    X_test, y_test = X[train_size:], y[train_size:]

    # Define LSTM model
    model = Sequential([
        LSTM(50, activation='relu', input_shape=(X_train.shape[1], 1)),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')

    # Train model
    history = model.fit(X_train, y_train, epochs=100, validation_data=(X_test, y_test), batch_size=16)
    return model, history

def plot_training_loss(history):
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.legend()
    plt.show()

def predict_future(data_scaled, sequence_length, model, scaler, n_future=6):
    last_sequence = data_scaled[-sequence_length:]
    predictions = []

    for _ in range(n_future):
        pred = model.predict(last_sequence.reshape(1, sequence_length, 1))
        predictions.append(pred[0, 0])
        last_sequence = np.append(last_sequence[1:], pred, axis=0)

    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
    return predictions.flatten()

def send_predictions(predictions):
    predictions_data = {'predictions_6_months': predictions.tolist()}
    response = requests.post(PREDICTIONS_URL, json=predictions_data)
    if response.status_code == 200:
        print("Predictions successfully sent to the server.")
    else:
        print(f"Failed to send predictions. Status code: {response.status_code}")

def get_data_hash(data):
    return hashlib.md5(data.to_string().encode()).hexdigest()

def main():
    previous_data_hash = None
    while True:
        response = requests.get(API_URL_GAINS)
        if response.status_code == 200:
            gains_data = response.json()
            gains_data = list(map(lambda x: x['total'], gains_data['data']))
            data = pd.DataFrame(gains_data, columns=['total'])

            # Check for data changes
            current_data_hash = get_data_hash(data)
            if current_data_hash != previous_data_hash:
                print("Data has changed. Reprocessing...")
                previous_data_hash = current_data_hash

                try:
                    X, y, sequence_length, scaler, data_scaled = preprocess_data(data)
                    model, history = train_model(X, y)
                    plot_training_loss(history)

                    predictions = predict_future(data_scaled, sequence_length, model, scaler)
                    print(f"Predicted income for the next 6 months: {predictions}")

                    send_predictions(predictions)
                except Exception as e:
                    print(f"Error processing data: {e}")
            else:
                print("No changes in data. Listening for updates...")
        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")

        time.sleep(30)  # Wait for 30 seconds before checking again

if __name__ == '__main__':
    main()
