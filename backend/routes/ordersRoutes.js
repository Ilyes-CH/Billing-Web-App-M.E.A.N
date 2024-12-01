/**
 * @Access customer
 * @Actions GET | POST | DELETE
 * @Security Level 1
 */
const express = require('express')
const Order = require('../models/order')
const Invoice = require('../models/invoice')
const Notice = require('../models/notice')
const verifyObjectId = require('../helpers/verifyObjectId')
const createInvoiceFile = require('../helpers/createInvoiceFile')
const Gain = require('../models/gains')
const findMany = require('../helpers/findManyServices')
const path = require('path')
// const uuid = require('uuid');
const router = express.Router();



/**
  *@generate Invoice before order
 */
router.post('/addOrder', async (req, res) => {
  console.log("\x1b[35m*******************Add Order Route\x1b[0m");

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const { servicesIds, studentId, quantity } = req.body;

  try {
    const docs = await findMany(servicesIds);

    const notices = await Notice.find({
      serviceIds: { $all: servicesIds },
      customerId: studentId,
      $expr: { $eq: [{ $size: "$serviceIds" }, servicesIds.length] },
    }).populate(['serviceIds', 'customerId']);

    if (!notices.length) {
      return res.status(400).json({ message: 'Must Create a Notice Before Placing an Order' });
    }

    let matchingNotice = notices.find(notice =>
      JSON.stringify(notice.quantity) === JSON.stringify(quantity)
    );

    if (!matchingNotice) {
      return res.status(400).json({ message: 'No matching notice found' });
    }

    var { customerId, serviceIds, total, taxRate, taxAmount, subtotal } = matchingNotice;
    var mappedServiceIds = serviceIds.map((s, i) => {
      const taxAmount = (taxRate / 100) * s.priceHT;
      const priceAfterTax = taxAmount + s.priceHT;  
      const totalAfterTax = priceAfterTax * quantity[i]; 
    
      return {
        name: s.name,
        priceHT: s.priceHT,
        quantity: quantity[i], 
        taxAmount, 
        priceAfterTax,
        totalAfterTax,
      };
    });
    const invoiceData = {
      firstName: customerId.firstName,
      lastName: customerId.lastName,
      email: customerId.email,
      phone: customerId.phone,
      items: mappedServiceIds,
      total,
      taxRate,
      taxAmount,
      subtotal
    };
 
    console.log(serviceIds)

    const order = await new Order({ serviceIds, customerId: customerId._id, total }).save();
    const gain = await new Gain({ customerId, orderId: order._id, total }).save();

    const [isInvoiceCreated, filePath] = await createInvoiceFile(invoiceData);
    if (!isInvoiceCreated) throw new Error('Invoice creation failed');

    const invoice = await new Invoice({
      serviceIds,
      details: order.details,
      customerId,
      orderId: order._id,
      path: `http://localhost:3000/pdfs/${path.basename(filePath)}`,
    }).save();

    order.invoiceId = invoice._id;
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (error) {
    console.error("\x1b[31mError placing the order:\x1b[0m", error);
    res.status(500).json({ message: 'Error placing the order' });
  }
});



//send all Orders to Accountant
router.get('/', (req, res) => {
  console.log("\x1b[35m*******************Get All Orders Route\x1b[0m");

  Order.find().populate(['serviceIds', 'customerId', 'invoiceId','archivedUserId']).then((docs) => {

    res.status(docs.length > 0 ? 200 : 404).json({ message: docs.length > 0 ? 'Found All Orders' : 'No Orders found', data: docs });


  }).catch((e) => {
    console.log("\x1b[31m*******************Error: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });

  })
});

//delete order along with its invoice
router.delete('/order/:id', (req, res) => {
  console.log("\x1b[35m*******************Delete Order By Id Route\x1b[0m");

  if (req.params.id) {
    console.log(req.params.id);

    if (!verifyObjectId(req.params.id)) {
      res.status(400).json({ message: 'Invalid Order ID format' });

    }
    else {
      Order.findById(req.params.id).populate(['invoiceId']).then((doc) => {
        if (doc) {
          //delete the invoice of the order
          Invoice.deleteOne({ _id: doc.invoiceId }).then((response) => {
            if (response.deletedCount == 1) {
              //if there is an order there must be an invoice created once the order is placed and each order has ONE invoice
              //delete the order from the db
              Order.deleteOne({ _id: req.params.id }).then((result) => {
                result.deletedCount == 1 ? res.status(200).json({ message: 'order Deleted' }) : res.status(304).json({ message: 'Error Deleting Order' })
              }).catch((e) => {
                console.log("\x1b[31m*******************Error: \x1b[0m", e);
                res.status(500).json({ message: 'Internal Server Error' });
              })
            } else {
              res.status(304).json({ message: 'order: invoice not deleted' })
            }
          }).catch((e) => {
            console.log(`\x1b[31mError In deletion of Invoice:\x1b[0m ${e}`)

            res.status(500).json({ message: 'Internal Server Error' });
          })
        } else {
          res.status(404).json({ message: 'Order Not Found' })
        }
      })
    }
  }
  else {
    res.status(304).json({ message: 'No order Id found/No Deletion' });
  }
});

//get all orders for each customer
router.get('/:customerId', (req, res) => {
  console.log("\x1b[35m*******************Get Orders By Customer Id Route\x1b[0m");
  const customerId = req.params.customerId
  console.log(customerId)
  if (customerId) {
    console.log("Customer Id:", customerId);

    if (!verifyObjectId(customerId)) {
      res.status(400).json({ message: 'Invalid order ID format' });
    } else {

      Order.find({ customerId }).populate(['serviceIds', 'customerId', 'invoiceId'])
        .then((customerOrders) => {

          if (customerOrders.length > 0) {

            res.status(200).json({ message: 'Found Customer Orders', data: customerOrders })

          } else {
            res.status(404).json({ message: 'No Orders found' });
          }
        }).catch((e) => {

          console.log("\x1b[31m*******************Error: \x1b[0m", e);
          res.status(500).json({ message: 'Internal Server Error' });

        })

    }
  } else {
    res.status(400).json({ message: 'No Customer Id Supplied' });

  }

});

//Get order By its Id
router.get('/order/:id', (req, res) => {
  console.log("\x1b[35m*******************Get Order By Id Route\x1b[0m");
  if (req.params.id) {
    console.log("order Id:", req.params.id);
    if (verifyObjectId(req.params.id)) {

      Order.findById(req.params.id).then((order) => {
        if (order) {
          res.status(200).json({ message: 'Order Found', data: order })
        } else {
          res.status(404).json({ message: 'order not found' });

        }

      }).catch((e) => {
        console.log("\x1b[31m*******************Error: \x1b[0m", e);
        res.status(500).json({ message: 'Internal Server Error' });
      })


    } else {
      res.status(400).json({ message: 'Invalid order ID format' });

    }
  } else {
    res.status(400).json({ message: 'No order Id Supplied' });

  }
})

module.exports = router;


/**
 * @IMPORTANT To be revised I was out dizzy when coding this ATM
 */
