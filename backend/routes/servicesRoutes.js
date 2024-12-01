/**
 * @Actions POST | GET| PUT | DELETE
 * @Security Level 2
 * @Access Admin Customer Accountant
 */

const express = require('express');
const Service = require('../models/services')
const verifyObjectId = require('../helpers/verifyObjectId')
const router = express.Router()
const multerConfig = require('../helpers/imageMulterConfig')
const multer = require('multer')



//get all minus prices
router.get('/', async (req, res) => {
  console.log("\x1b[35m*******************Get All Services Route\x1b[0m");
  try {
    var services = await Service.find().select('-priceHT')
    if (services.length > 0) {
      res.status(200).json({ message: "Found All Services", data: services })
    } else {
      res.status(200).json({ message: "OK, Empty Services Collection", data: services })

    }
  } catch (e) {
    console.error("\x1b[31m*******************Error in getting all services: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})
router.get('/allCourses', async (req, res) => {
  console.log("\x1b[35m*******************Get All Services Route\x1b[0m");
  try {
    var services = await Service.find()
    if (services.length > 0) {
      res.status(200).json({ message: "Found All Services", data: services })
    } else {
      res.status(200).json({ message: "OK, Empty Services Collection", data: services })

    }
  } catch (e) {
    console.error("\x1b[31m*******************Error in getting all services: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }

}) 

//get service by id WITHOUT PRICE for Students
router.get('/service/course/:id', async (req, res) => {
  console.log("\x1b[35m*******************Get Service By Id Route\x1b[0m");
  try {
    if (req.params.id) {
      if (verifyObjectId(req.params.id)) {
          console.log('Service ID: ',req.params.id)
        var service = await Service.findById(req.params.id).select('-priceHT')
        console.log(service)
        if (service) {
          res.status(200).json({ message: "Found Service", data: service })
        } else {
          res.status(404).json({ message: "Service Not Found" })

        }
      } else {
        res.status(400).json({ message: "Malformed Service Id" })

      }
    } else {
      res.status(400).json({ message: "No Service Id Supplied" })

    }
  } catch (e) {
    console.error("\x1b[31m*******************Error in getting service by id: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})

//get service by id
router.get('/service/:id', async (req, res) => {
  console.log("\x1b[35m*******************Get Service By Id Route\x1b[0m");
  try {
    if (req.params.id) {
      if (verifyObjectId(req.params.id)) {
          console.log('Service ID: ',req.params.id)
        var service = await Service.findById(req.params.id)
        console.log(service)
        if (service) {
          res.status(200).json({ message: "Found Service", data: service })
        } else {
          res.status(404).json({ message: "Service Not Found" })

        }
      } else {
        res.status(400).json({ message: "Malformed Service Id" })

      }
    } else {
      res.status(400).json({ message: "No Service Id Supplied" })

    }
  } catch (e) {
    console.error("\x1b[31m*******************Error in getting service by id: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})
//add service
router.post('/',  multer({ storage: multerConfig }).single('img'), async (req, res) => {
  console.log("\x1b[35m*******************Post New Service Route\x1b[0m");
  const serviceObj = req.body;
  try {
    console.log(serviceObj)
    console.log(req.file)
    if (Object.keys(serviceObj).length !== 0) {

      serviceObj.details = JSON.parse(serviceObj.details)
      if (req.file) {
        serviceObj.image = `http://127.0.0.1:3000/images/${req.file.filename}`;
      } else {
        serviceObj.image = `http://127.0.0.1:3000/images/avatar.png`;
      }
      let service = new Service(serviceObj)
      let response = await service.save()
      if (!response) {
        res.status(400).json({ message: 'Error adding the service ' })
      } else {
        res.status(201).json({ message: 'New Service Added Successfully' })
      }
    } else {
      res.status(400).json({ message: 'Empty Object Supplied' })

    }
  } catch (e) {
    console.error("\x1b[31m*******************Error in posting a new service: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

//remove service
router.delete('/:id', async (req, res) => {
  console.log("\x1b[35m*******************Delete Service By Id Route\x1b[0m");
  if (req.params.id) {
    if (verifyObjectId(req.params.id)) {
      try {
        const response = await Service.deleteOne({ _id: req.params.id })

        response.deletedCount == 1 ? res.status(200).json({ message: 'Service Deleted With Success' }) : res.status(304).json({ message: 'Service Not Deleted' })

      } catch (e) {
        console.error("\x1b[31m*******************Error in deleting the service: \x1b[0m", e);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      res.status(400).json({ message: 'Malformed Id ' })

    }
  } else {
    res.status(400).json({ message: 'No Id Was Supplied' })
  }
})



//remove all services
router.delete('/', async (req, res) => {
  console.log("\x1b[35m*******************Delete All Services Route\x1b[0m");

  try {
    const response = await Service.deleteMany()

    response.deletedCount > 0 ? res.status(200).json({ message: 'Services Deleted With Success' }) : res.status(304).json({ message: 'Services Not Deleted/Not Modified' })

  } catch (e) {
    console.error("\x1b[31m*******************Error in deleting the services: \x1b[0m", e);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})

//update service
router.put('/', async (req, res) => {
  console.log("\x1b[35m*******************Update Service Route\x1b[0m");
  const patch = req.body
  console.log(patch)
  if (Object.keys(patch).length > 0) {
    try {
      const response = await Service.updateOne({ _id: patch._id }, patch);
      if (response.nModified == 1) {
        res.status(200).json({ message: 'Service was updated successfully' })
      } else {
        res.status(304).json({ message: 'Service was not updated' })

      }
    } catch (e) {
      console.error("\x1b[31m*******************Error in updating the service: \x1b[0m", e);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ message: 'Empty Body' })
  }
})


module.exports = router;
