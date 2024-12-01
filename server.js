const app = require('./backend/main/app');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const https = require('https');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/main/.env' });
const {v4: uuidv4} = require('uuid')



const serverOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert'))
};

const students = new Map();
const accountants = new Map();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.ACCESS_TOKEN_KEY;

// Start the Express server
const server = app.listen(PORT, () => {
    console.log(`\x1b[32m Server is Running http://127.0.0.1:${PORT}\x1b[0m`);
});

// Set up the WebSocket server
const wss = new WebSocket.Server({ server });

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null; // Invalid token
    }
}

wss.on('connection', (ws, req) => {
    const token = req.headers['sec-websocket-protocol']; // Extract token from headers
    const decoded = verifyToken(token); // Verify the token
            console.log(token)
            console.log(decoded)
    if (decoded) {
        const clientId = decoded.id;
        const role = decoded.role; // Either 'Student' or 'Accountant'

        // Register the client based on their role
        if (role === 'Accountant') {
            accountants.set(clientId, ws);
            console.log(`Accountant connected: ${clientId}`);
        } else if (role === 'Learner') {
            students.set(clientId, ws);
            console.log(`Student connected: ${clientId}`);
        } else {
            console.log(`Unrecognized role for client: ${clientId}`);
            ws.close(); // Close connection for unrecognized roles
            return;
        }

        ws.on('message', (message) => {
            const data = JSON.parse(message);

            // Handle communication between students and accountants
            if (data.type === 'message' && data.accountantId) {
                const accountantWs = accountants.get(data.accountantId);
                if (accountantWs && accountantWs.readyState === WebSocket.OPEN) {
                    console.log(`Student ${clientId} sent a message to Accountant ${data.accountantId}: ${JSON.stringify(data)}`);
                    const notificationId = uuidv4()
                    accountantWs.send(JSON.stringify({
                        type: 'notification',
                        from: clientId,
                        id: notificationId,
                        content: data.content,
                        serviceIds : data.serviceIds,
                        quantity : data.quantities
                    }));
                } else {
                    console.log(`Accountant ${data.accountantId} is not connected.`);
                }
            }
        });

        // Handle client disconnection
        ws.on('close', () => {
            if (role === 'Accountant') {
                accountants.delete(clientId);
                console.log(`Accountant disconnected: ${clientId}`);
            } else if (role === 'Student') {
                students.delete(clientId);
                console.log(`Student disconnected: ${clientId}`);
            }
        });
    } else {
        console.log('Invalid JWT token. Connection closed.');
        ws.close(); // Close connection for invalid token
    }
});
