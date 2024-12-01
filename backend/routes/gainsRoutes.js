/**
 * @Access access only to Admin && Accountant
 * @Actions GET 
 */



const express = require('express')
const router = express.Router();
const isValidObjectId = require('../helpers/verifyObjectId')

const Gain = require('../models/gains')


//predictions
router.post('/predictions', (req, res) => {

   
})


router.get('/', (req, res) => {

    Gain.find().populate(['ordersId']).then((docs) => {

        console.log("\x1b[35m*******************GET Gains Route\x1b[0m")
        if (docs.length > 0) {
            console.log(docs)
            res.status(200).json({ data: docs })
        } else {
            res.status(404).json({ message: "Gains not found" })
        }

    }).catch((e) => {
        console.log(`\x1b[31mError in getting Gains:\x1b[0m ${e}`)

        res.status(500).json({ message: 'Internal Server Error' })
    })
})

router.get('/:id', (req, res) => {
    console.log("\x1b[35m*******************GET Gain By Id Route\x1b[0m")
    const id = req.params.id
    if (isValidObjectId(id)) {

        Gain.findById(id).then((Gain) => {

            if (Gain) {

                res.status(200).json({ message: "Found Gain", data: Gain })
            } else {
                res.status(404).json({ message: "Gain Not Found" })

            }


        }).catch((e) => {
            console.log(`\x1b[31mError in getting the Gain:\x1b[0m ${e}`)

            res.status(500).json({ message: 'Internal Server Error' })
        })
    } else {
        res.sendStatus(400)
    }

})

module.exports = router;