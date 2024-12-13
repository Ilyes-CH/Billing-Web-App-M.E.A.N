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


// Enhanced rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  standardHeaders: true, 
  legacyHeaders: false, 
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip, // Track requests by IP
  handler: (req, res) => {
    console.log(`Rate Limiter: Limit exceeded for IP ${req.ip}`);
    
   
    console.log(Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000))
    // Respond with a message and retry-after time
    res.status(429).json({
      message: 'Too many requests. You have been logged out. Please try again after the cooldown period.',
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000),
    });
  },
});

// Apply the rate limiter middleware to your app
app.use(limiter);

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

