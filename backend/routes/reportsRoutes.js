const express = require('express')
const Report = require('../models/reports')
const isObjectId = require('../helpers/verifyObjectId')
const jwt = require("jsonwebtoken")
const authenticateToken = require('../middlewares/authenticateToken')
const router = express.Router()



router.get('/latest', authenticateToken, async (req, res) => {
    console.log("\x1b[35m*******************Get All Reports Route\x1b[0m");
    const authHeader = req.headers['Authorization'] || req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    console.log("verify token:", token)
    const decoded = jwt.decode(token)
    if (decoded.role && decoded.role !== "Admin" && decoded.role !== "Accountant") {
        res.status(403).json({ message: `Unauthorized` })

    } else {
        try {
            const reports = await Report.find().populate({ path: 'accountantId', select: '_id firstName lastName avatar' }).limit(-3)
            reports.length == 0 ? res.status(404).json({ message: 'No Reports Found' }) : res.status(200).json({ message: 'Found Reports', data: reports })
        } catch (error) {
            console.log(`\x1b[31mError In Get Reports: \x1b[0m ${error}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

router.get('/', authenticateToken, async (req, res) => {
    console.log("\x1b[35m*******************Get All Reports Route\x1b[0m");
    const authHeader = req.headers['Authorization'] || req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    console.log("verify token:", token)
    const decoded = jwt.decode(token)
    if (decoded.role && decoded.role !== "Admin" && decoded.role !== "Accountant") {
        res.status(403).json({ message: `Unauthorized` })

    } else {
        try {
            const reports = await Report.find().populate({ path: 'accountantId', select: '_id firstName lastName avatar' })
            reports.length == 0 ? res.status(404).json({ message: 'No Reports Found' }) : res.status(200).json({ message: 'Found Reports', data: reports })
        } catch (error) {
            console.log(`\x1b[31mError In Get Reports: \x1b[0m ${error}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

router.get('/:id', authenticateToken, async (req, res) => {
    const authHeader = req.headers['Authorization'] || req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    console.log("verify token:", token)
    const decoded = jwt.decode(token)
    if (decoded.role && decoded.role !== "Admin") {
        res.status(403).json({ message: `Unauthorized` })

    } else {
        console.log("\x1b[35m*******************Get Report By ID Route\x1b[0m");
        const id = req.params.id
        if (!id) {
            return res.status(400).json({ message: 'No Id Supplied' })
        }
        if (!isObjectId(id)) {
            return res.status(400).json({ message: 'Incorrect Format' })
        }
        try {

            const report = await Report.findById(id).populate({ path: 'accountantId', select: '_id firstName lastName avatar' })
            console.log(report)
            !report ? res.status(404).json({ message: 'Report Not Found' }) : res.status(200).json({ message: 'Report Found', data: report })

        } catch (error) {
            console.log(`\x1b[31mError In Get Report By ID: \x1b[0m ${error}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

router.post('/newReport', authenticateToken, async (req, res) => {
    console.log("\x1b[35m*******************Post Report Route\x1b[0m");
    const authHeader = req.headers['Authorization'] || req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    console.log("verify token:", token)
    const decoded = jwt.decode(token)
    if (decoded.role && decoded.role !== "Accountant") {
        res.status(403).json({ message: `Unauthorized` })

    } else {
        const newReport = req.body;
        console.log(newReport)
        if (!newReport) {
            return res.status(400).json({ message: 'Empty Body Request' })
        }
        try {
            let report = new Report(newReport)
            const doc = await report.save()
            if (doc) {
                res.status(201).json({ message: 'New Report Added With Success' })
            } else {
                res.status(400).json({ message: 'Error Saving Report' })
            }


        } catch (error) {
            console.log(`\x1b[31mError In Post Report: \x1b[0m ${error}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

module.exports = router