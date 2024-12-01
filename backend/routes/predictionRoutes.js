const express = require('express')
const Prediction = require('../models/prediction')
const router = express.Router()


router.get('/', async (req, res) => {
    console.log("\x1b[35m*******************GET Predictions Route\x1b[0m")

    try {
        const preds = await Prediction.find()
        preds.length == 0 ? res.status(404).json({ message: 'No predicions' }) : res.status(200).json({ message: 'Found predictions', data: preds })
    }
    catch (error) {
        console.log(`\x1b[31mError in getting Predictions:\x1b[0m ${error}`)

        res.status(500).json({ message: 'Internal Server Error' })
    }
})


router.post('/', async (req, res) => {
    console.log("\x1b[35m*******************Post Predictions Route\x1b[0m");
    try {
        let predictionsInput = req.body;
        console.log(predictionsInput)
        if (!predictionsInput || !predictionsInput.predictions_6_months) {
            return res.status(400).json({ message: 'Empty or invalid Body Request' });
        }

        // Try to find the document. If it doesn't exist, create one.
        let predictionDoc = await Prediction.findOne();
        
        // If the document exists, push the new prediction
        if (predictionDoc) {
            predictionDoc.predictions =predictionsInput.predictions_6_months
            await predictionDoc.save();
            return res.status(200).json({ message: 'Prediction Pushed Successfully', data: predictionDoc });
        }

        // If the document doesn't exist, create a new one
        predictionDoc = new Prediction({
            predictions: predictionsInput.predictions,
        });

        // Save the new document
        await predictionDoc.save();
        return res.status(201).json({ message: 'New Prediction Document Created and Saved', data: predictionDoc });

    } catch (error) {
        console.log(`\x1b[31mError in Posting Predictions:\x1b[0m ${error}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;