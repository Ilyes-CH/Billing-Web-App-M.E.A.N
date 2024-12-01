const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config({ path: './backend/main/.env' });

const API_KEY = process.env.API_KEY
const Topic = "software engineering"
const URI = `https://newsapi.org/v2/everything?q=${Topic}&apiKey=${API_KEY}`


router.get('/',async(req,res)=>{
    try{
        const data = await axios.get(URI)
        console.log(data)
        res.json({"data":data.data})

    }catch(e){
            res.status(500).json({"message": "Internal Server Error"})
    }
})

module.exports = router;