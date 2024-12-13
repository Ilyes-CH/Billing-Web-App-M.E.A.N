const express = require('express');
const fs = require('fs');
const checkDiskSpace = require('check-disk-space')
const jwt = require("jsonwebtoken")
const authenticateToken = require('../middlewares/authenticateToken')

const router = express.Router()
const rootPath = '/';
router.get('/disk-info', authenticateToken ,async (req, res) => {
  const authHeader = req.headers['Authorization'] || req.headers["authorization"]
  const token = authHeader && authHeader.split(' ')[1]
  console.log("verify token:", token)
  const decoded = jwt.decode(token)
  if (decoded.role && decoded.role !== "Admin" && decoded.role !== "Accountant") {
    res.status(403).json({ message: `Unauthorized` })

  } else {
    try {
        const storage = await checkDiskSpace(rootPath);
        res.json({
          free: storage.free, // Free disk space in bytes
          size: storage.size, // Total disk space in bytes
          used: storage.size - storage.free // Used space in bytes
        });
        console.log(storage)
      } catch (error) {
        console.error('Error fetching storage details:', error);
        res.status(500).send('Failed to get storage details');
      }
    }
})
module.exports = router;