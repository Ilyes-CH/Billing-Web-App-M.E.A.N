/**
 * @upload a pdf by accountant
 * @Access accountant | admin
 * @Actions GET | POST | DELETE
 * @Security Level 2
 */
const express = require('express')
const Notice = require('../models/notice')
const authenticateToken = require('../middlewares/authenticateToken')
const User = require('../models/user')
const path = require('path')
const createNoticeFile = require('../helpers/createNoticeFile')
const verifyObjectId = require('../helpers/verifyObjectId')
const jwt = require("jsonwebtoken")
const router = express.Router();




/**@TODO Update the notice to save  */
router.post('/addNotice', authenticateToken, async (req, res) => {
  console.log("\x1b[35m*******************Add Notice Route\x1b[0m");
  console.log(req.body);
  const authHeader = req.headers['Authorization'] || req.headers["authorization"]
  const token = authHeader && authHeader.split(' ')[1]
  console.log("verify token:", token)
  const decoded = jwt.decode(token)
  if (decoded.role && decoded.role !== "Accountant") {
    res.status(403).json({ message: `Unauthorized` })

  } else {
    const newNotice = {
      serviceIds: req.body.services.map((s) => s = s._id),
      quantity: req.body.services.map((s) => s = s.quantity),
      details: req.body.details,
      customerId: req.body.customerId,
      subtotal: req.body.subTotal,
      taxRate: req.body.taxRate,
      taxPerService: req.body.taxPerService,
      taxAmount: req.body.totalTaxAmount,
      total: req.body.totalWithTax,
    };

    try {
      // Find the user document
      const doc = await User.findById(req.body.customerId);

      if (!doc) {
        console.log("\x1b[31m*******************Error: User does not exist or not authorized\x1b[0m");
        return res.status(401).json({ message: 'User Unauthorized' });
      }

      // Prepare noticeInfo
      const noticeInfo = {
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        phone: doc.phone,
        items: req.body.services,
        details: req.body.details,
        subTotal: req.body.subTotal,
        taxRate: req.body.taxRate,
        taxAmount: req.body.totalTaxAmount,
        total: req.body.totalWithTax,
      };
      console.log('Notice Info', noticeInfo)
      // Create the Notice PDF
      const isNoticePdfCreated = await createNoticeFile(noticeInfo);

      if (isNoticePdfCreated[0]) { // Check if PDF was created successfully
        const pdfFilePath = isNoticePdfCreated[1];
        console.log(pdfFilePath)
        newNotice['path'] = `http://127.0.0.1:3000/pdfs/${path.basename(pdfFilePath)}`;

        // Save notice to the database
        const notice = new Notice(newNotice);
        const savedNotice = await notice.save();

        res.status(201).json({ message: 'PDF uploaded successfully', file: newNotice['path'] });
      } else {
        console.log("\x1b[31m*******************Error In Creation Of Notice PDF\x1b[0m");
        res.status(400).json({ message: 'Error In Notice Request' });
      }
    } catch (error) {
      console.error("\x1b[31m*******************Error\x1b[0m", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

//send all notices to Accountant
router.get('/', authenticateToken,(req, res) => {
  console.log("\x1b[35m*******************Get All Notices Route\x1b[0m");
  const authHeader = req.headers['Authorization'] || req.headers["authorization"]
  const token = authHeader && authHeader.split(' ')[1]
  console.log("verify token:", token)
  const decoded = jwt.decode(token)
  if (decoded.role && decoded.role !== "Admin") {
    res.status(403).json({ message: `Unauthorized` })

  } else {
  Notice.find().populate(['serviceIds', 'customerId']).then((docs) => {

    res.status(docs.length > 0 ? 200 : 404).json({ message: docs.length > 0 ? 'Found All notices' : 'No notices found', data: docs });


  }).catch((e) => {
    console.log("\x1b[31m*******************Error: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });

  })

  }
});

router.delete('/:id', authenticateToken,(req, res) => {
  console.log("\x1b[35m*******************Delete Notice By Id Route\x1b[0m");

  if (req.params.id) {
    console.log(req.params.id);

    if (!verifyObjectId(req.params.id)) {
      res.status(400).json({ message: 'Invalid notice ID format' });

    }
    else {
      Notice.deleteOne({ _id: req.params.id }).then((response) => {
        response.deletedCount == 1 ? res.status(200).json({ message: 'notice Deleted' }) : res.status(304).json({ message: 'Error Deleting' })
      }).catch((e) => {
        console.log("\x1b[31m*******************Error in deleting the notice: \x1b[0m", e);
        res.status(500).json({ message: 'Internal Server Error' });

      })
    }
  }

  else {
    res.status(304).json({ message: 'No notice Id found/No Deletion' });


  }

});

//get all notices for each customer
router.get('/customer/:customerId', authenticateToken,(req, res) => {
  console.log("\x1b[35m*******************Get Notices By Customer Id Route\x1b[0m");
  const customerId = req.params.customerId
  if (customerId) {
    console.log("Customer Id:", customerId);

    if (!verifyObjectId(customerId)) {
      res.status(400).json({ message: 'Invalid notice ID format' });
    } else {

      Notice.find({ customerId: { $all: customerId } }).populate(['serviceIds'])
        .then((customerNotices) => {
          console.log(customerNotices)
          if (customerNotices.length > 0) {

            res.status(200).json({ message: 'Found Customer notices', data: customerNotices })

          } else {
            res.status(404).json({ message: 'No notices found' });
          }
        }).catch((e) => {

          console.log("\x1b[31m*******************Error in getting customers' notices: \x1b[0m", e);
          res.status(500).json({ message: 'Internal Server Error' });

        })

    }
  } else {
    res.status(400).json({ message: 'No Customer Id Supplied' });

  }

});

//Get notice By its Id
router.get('/notice/:id', authenticateToken,(req, res) => {
  console.log("\x1b[35m*******************Get Notice By Id Route\x1b[0m");
  if (req.params.id) {
    console.log("notice Id:", req.params.id);
    if (verifyObjectId(req.params.id)) {

      Notice.findById(req.params.id).then((notice) => {
        if (notice) {
          res.status(200).json({ message: 'notice Found', data: notice })
        } else {
          res.status(404).json({ message: ' notice not found' });

        }

      }).catch((e) => {
        console.log("\x1b[31m*******************Error in getting the notice by id: \x1b[0m", e);
        res.status(500).json({ message: 'Internal Server Error' });
      })


    } else {
      res.status(400).json({ message: 'Invalid notice ID format' });

    }
  } else {
    res.status(400).json({ message: 'No notice Id Supplied' });

  }
})

module.exports = router;
