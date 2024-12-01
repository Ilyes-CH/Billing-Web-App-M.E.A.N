const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../main/.env' });

const accessTokenKey = process.env.ACCESS_TOKEN_KEY


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers["authorization"]
  const token = authHeader && authHeader.split(' ')[1]
  console.log("verify token:", token)
  if (!token) return res.sendStatus(401)

  jwt.verify(token, accessTokenKey, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authenticateToken;
