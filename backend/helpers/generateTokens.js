const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './backend/main/.env' });


const accessTokenKey = process.env.ACCESS_TOKEN_KEY
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY

const generateAccessToken =  (paylod) => {
  return jwt.sign(paylod, accessTokenKey, { expiresIn: '1h' })
}

const generateRefreshToken = (paylod) => {
  return jwt.sign(paylod, refreshTokenKey, { expiresIn: '30d' })
}
console.log("Access Token Key:", accessTokenKey);
console.log("Refresh Token Key:", refreshTokenKey);

module.exports= [
  generateAccessToken,
  generateRefreshToken
]
