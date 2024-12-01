/**
 * @upload a pdf by accountant
 * @Access accountant | admin
 * @Actions GET | POST | DELETE
 * @Security Level 2
 */
// const multer = require('multer')
// const multerPdfConfig = require('../helpers/pdfMulterConfig');
const express = require('express')
const Invoice = require('../models/invoice')
const verifyObjectId = require('../helpers/verifyObjectId')
const router = express.Router();

// router.post('/addInvoice', multer({ storage: multerPdfConfig }).single('pdf'), (req, res) => {
//   console.log("\x1b[35m*******************Add Invoice Route\x1b[0m");
//   console.log(req.file, req.body);
//   const newInvoice = {
//     serviceId: req.body.serviceId,
//     details: req.body.details,
//     customerId: req.body.customerId,
//     orderId: req.body.orderId,
//   }
//   if (req.file) {
//     newInvoice['path'] = `http://127.0.0.1:3000/pdfs/${req.file.filename}`
//     let invoice = new Invoice(newInvoice)
//     invoice.save((err, doc) => {
//       if (doc) {

//         res.status(201).json({ message: 'PDF uploaded successfully', file: req.file });
//       } else {
//         res.status(400).json({ message: 'PDF upload failed' });

//       }
//     })
//   } else {
//     res.status(422).json({ message: 'No file supplied' });

//   }

// });

//send all invoices to Accountant
router.get('/', (req, res) => {
  console.log("\x1b[35m*******************Get All Invoices Route\x1b[0m");

  Invoice.find().populate(['serviceIds', 'customerId', 'orderId','archivedUserId']).then((docs) => {

    if (docs) {
      console.log(docs)
      res.status(200).json({ message: 'Found All Invoices', data: docs })
    } else {
      res.status(404).json({ message: 'No invoices found' });
    }

  }).catch((e) => {
    console.log("\x1b[31m*******************Error in getting the invoices: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });

  })


});

router.delete('/:id', (req, res) => {
  console.log("\x1b[35m*******************Delete Invoice By Id Route\x1b[0m");

  if (req.params.id) {
    console.log(req.params.id);

    if (!verifyObjectId(req.params.id)) {
      res.status(400).json({ message: 'Invalid Invoice ID format' });
    }
    else {
      Invoice.deleteOne({ _id: req.params.id }).then((response) => {
        response.deletedCount == 1 ? res.status(200).json({ message: 'Invoice Deleted' }) : res.status(304).json({ message: 'Error Deleting' })
      })
      .catch((e) => {
        console.log("\x1b[31m*******************Error in deleting the the invoice: \x1b[0m", e);
        res.status(500).json({ message: 'Internal Server Error' });
      })
    }
  }
  else {
    res.status(304).json({ message: 'No Invoice Id found/No Deletion' })
  }
});

//get all invoices for each customer
router.get('/:customerId', (req, res) => {
  console.log("\x1b[35m*******************Get Invoices By Customer Id Route\x1b[0m");
  const customerId = req.params.customerId
  if (customerId) {
    console.log("Customer Id:", customerId);

    if (!verifyObjectId(customerId)) {
      res.status(400).json({ message: 'Invalid Invoice ID format' });
    } else {

      Invoice.find({ customerId }).populate(['serviceIds', 'customerId', 'orderId'])
        .then((customerInvoices) => {

          if (customerInvoices.length > 0) {

            res.status(200).json({ message: 'Found Customer Invoices', data: customerInvoices })

          } else {
            res.status(404).json({ message: 'No invoices found' });
          }
        }).catch((e) => {

          console.log("\x1b[31m*******************Error in getting invoices for customer: \x1b[0m", e);
          res.status(500).json({ message: 'Internal Server Error' });

        })

    }
  } else {
    res.status(400).json({ message: 'No Customer Id Supplied' });

  }

});

//Get Invoice By its Id
router.get('/invoice/:id', (req, res) => {
  console.log("\x1b[35m*******************Get Invoice By Id Route\x1b[0m");
  if (req.params.id) {
    console.log("Invoice Id:", req.params.id);
    if (verifyObjectId(req.params.id)) {

      Invoice.findById(req.params.id).then((invoice) => {
        if (invoice) {
          res.status(200).json({ message: 'Invoice Found', data: invoice })
        } else {
          res.status(404).json({ message: ' invoice not found' });

        }

      }).catch((e) => {
        console.log("\x1b[31m*******************Error in getting invoice by id: \x1b[0m", e);
        res.status(500).json({ message: 'Internal Server Error' });
      })


    } else {
      res.status(400).json({ message: 'Invalid Invoice ID format' });

    }
  } else {
    res.status(400).json({ message: 'No Invoice Id Supplied' });

  }
})

module.exports = router;
