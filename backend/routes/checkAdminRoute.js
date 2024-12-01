/**
 * @Action GET
 * @Job check if there is in the db an admin or not
 */
const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get("/", (req, res) => {
  User.findOne({ role: "Admin" }).then((response) => {
    if (response) {
      res.sendStatus(200)
    }else{
      res.sendStatus(404)
    }
  })
})

module.exports = router;
