const express = require('express');
const fs = require('fs');
const checkDiskSpace = require('check-disk-space')
const path = require('path');

const router = express.Router()
const rootPath = '/';
router.get('/disk-info', async (req, res) => {
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
})
module.exports = router;