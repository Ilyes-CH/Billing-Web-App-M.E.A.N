const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../main/.env' });



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers["authorization"]
  const token = authHeader && authHeader.split(' ')[1]
  console.log("verify token:", token)
  if (!token) return res.status(401).json({message:"Bad Request"})

    console.log("KEY: ",process.env.ACCESS_TOKEN_KEY)
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {

    if (err) return res.status(403).json({message:"Forbidden"})
    req.user = user
    next()
  })
}

module.exports = authenticateToken;
