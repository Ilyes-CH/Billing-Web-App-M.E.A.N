/**
 * @Actions GET | POST
 * if negative do not show if positive show 
 * @Security Level 1
 */

const express = require('express')
const FeedBack = require('../models/feedback')
const isObjectId = require('../helpers/verifyObjectId')
const authenticateToken = require('../middlewares/authenticateToken')
const jwt = require("jsonwebtoken")

const router = express.Router()

/**@returns {Array}- FeedBack Objects */
router.get('/',authenticateToken ,async (req, res) => {
    console.log("\x1b[35m*******************Get FeedBacks For Admin Route\x1b[0m");

  const authHeader = req.headers['Authorization'] || req.headers["authorization"]
  const token = authHeader && authHeader.split(' ')[1]
  console.log("verify token:", token)
  const decoded = jwt.decode(token)
  if (decoded.role && decoded.role !== "Admin") {
    res.status(403).json({ message: `Unauthorized` })

  } else {
    try {
        const feedbacks = await FeedBack.find().populate({
            path: 'commentorId', select: 'firstName lastName avatar -_id'
        })
        feedbacks.length == 0 ? res.status(404).json({ message: 'Feedbacks not Found' }) : res.status(200).json({ message: 'feedbacks are found', data: feedbacks })

    } catch (error) {
        console.log(`\x1b[31mError In Get Feedbacks: \x1b[0m ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
})

router.get('/count',authenticateToken, async (req, res) => {
    console.log("\x1b[35m*******************Get FeedBacks Route\x1b[0m");

    const authHeader = req.headers['Authorization'] || req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    console.log("verify token:", token)
    const decoded = jwt.decode(token)
    if (decoded.role && decoded.role !== "Admin" && decoded.role !== "Accountant") {
        res.status(403).json({ message: `Unauthorized` })
  
    } else {
    try {
        const feedbacks = await FeedBack.find()
        feedbacks.length == 0 ? res.status(404).json({ message: 'Feedbacks not Found' }) : res.status(200).json({ message: 'feedbacks are found', data: feedbacks.length, updatedAt: feedbacks[feedbacks.length - 1]['date'] })

    } catch (error) {
        console.log(`\x1b[31mError In Get Feedbacks: \x1b[0m ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
})


router.get('/feedbacks', async (req, res) => {
    console.log("\x1b[35m*******************Get FeedBacks For Users Route\x1b[0m");

    try {
        const feedbacks = await FeedBack.find().populate({
            path: 'commentorId', select: 'firstName lastName avatar -_id'
        })
        if (feedbacks.length < 0) return res.status(404).json({ message: 'Feedbacks Not Found' })
        const positiveFeedbacks = feedbacks.filter((feedback) => feedback.type == 'Positive')
        if (positiveFeedbacks.length >= 4) {
            res.status(200).json({ message: 'Found Feedbacks', data: positiveFeedbacks.slice(0, 3) })
        } else {
            res.status(200).json({ message: 'Found Feedbacks', data: positiveFeedbacks })

        }


    } catch (error) {
        console.log(`\x1b[31mError In Get Feedbacks: \x1b[0m ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


/**@returns {String}- FeedBack Confirmation */
router.post('/newFeedBack',authenticateToken, async (req, res) => {
    console.log("\x1b[35m*******************Post FeedBack Route\x1b[0m");

    const authHeader = req.headers['Authorization'] || req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    console.log("verify token:", token)
    const decoded = jwt.decode(token)
    if (decoded.role && decoded.role !== "Admin") {
      res.status(403).json({ message: `Unauthorized` })
  
    } else {
    const newFeedBack = req.body
    console.log(newFeedBack)
    if (!newFeedBack) {
        return res.status(400).json({ message: 'Bad Request' })
    }
    try {
        let feedback = new FeedBack(newFeedBack)
        const doc = await feedback.save()
        if (doc) {
            res.status(201).json({ message: 'New FeedBack Added With Success' })
        } else {
            res.status(400).json({ message: 'Error Saving Report' })
        }

    } catch (error) {
        console.log(`\x1b[31mError In Post Feedback: \x1b[0m ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
})


router.delete('/:id',authenticateToken, async (req, res) => {

    const authHeader = req.headers['Authorization'] || req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    console.log("verify token:", token)
    const decoded = jwt.decode(token)
    if (decoded.role && decoded.role !== "Admin") {
      res.status(403).json({ message: `Unauthorized` })
  
    } else {
    try {
        const feedbackId = req.params.id
        if (!feedbackId) return res.status(400).json({ message: 'Missing ID' })
        if (!isObjectId(feedbackId)) return res.status(400).json({ message: 'Bad Format' })

        const feedbackDeletion = await FeedBack.deleteOne({ _id: feedbackId })
        feedbackDeletion.deletedCount == 1 ? res.status(200).json({ message: 'FeedBack was deleted' }) : res.status(304).json({ message: 'Feedback Was not deleted' })
    } catch (error) {
        console.log(`\x1b[31mError In Post Feedback: \x1b[0m ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }
})

module.exports = router
