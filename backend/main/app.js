const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const session = require('express-session')
const path = require('path')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
//initialize && config
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



mongoose.connect("mongodb://127.0.0.1:27017/bootcamp_management").then((res) => {
  // console.log(res)

}).catch((e) => {
  console.log(e)
  setTimeout(() => {
    mongoose.connect("mongodb://127.0.0.1:27017/bootcamp_management")
      .then(() => {
        console.log("Reconnected to MongoDB successfully");
      })
      .catch((err) => {
        console.error("Failed to reconnect to MongoDB:", err);
      });
  }, 5000);
})


//rateLimiter
const limiter = rateLimit.rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (req, res) => {
    console.log("Rate Limiter: Limit Exceeded")
    res.status(429).json({
      message: 'Too many requests. Please try again later.',
      retryAfter: req.rateLimit.resetTime, 
    });
  }
})
app.use(limiter)

//cors configuration
app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(

    "Access-Control-Allow-Headers",

    "Origin, Accept, Content-Type, X-Requested-with, Authorization"

  );

  res.setHeader(

    "Access-Control-Allow-Methods",

    "GET, POST, DELETE, OPTIONS, PATCH, PUT"

  );

  next();

});
// app.use(cors())

app.use("/images", express.static(path.join("backend/uploads/images")))

app.use("/pdfs", express.static(path.join("backend/uploads/pdfs")));



//import routes

const routes = require('../routes')

app.use('/api', routes)

module.exports = app

