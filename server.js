const PORT = 8000
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { Configuration, OpenAIApi } = require("openai")
const multer = require('multer')
require('dotenv').config()

const app = express()
// Open AI
const configuration = new Configuration({
    apiKey: process.env.API_KEY
})
const openai = new OpenAIApi(configuration)
// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Images are stored in public folder
        cb(null, 'public')
    }, 
    filename: (req, file, cb) => {
        console.log('file', file)
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage }).single('file') 
let filePath

app.use(cors())
app.use(express.json())

app.post('/images', async (req, res) => {
    try{
        const response = await openai.createImage({
            prompt: req.body.message,
            n: 9,
            size: '1024x1024',
        })
        console.log(response.data.data)
        res.send(response.data.data)
    } catch(error){
        console.error(error)
    }
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err instanceof multer.MulterError){
            return res.status(500).json(err)
        }
        else if(err){
            return res.status(500).json(err)
        }
        console.log(req.file.path)
        filePath = req.file.path
    })
})

app.post('/variations', async (req, res) => {
    try{
        const response = await openai.createImageVariation(
            fs.createReadStream(filePath),
            9,
            "1024x1024"
        )
        res.send(response.data.data)
    } catch(error){
        console.error(error)
    }
})

app.listen(PORT, () => console.log(`Server is running on the PORT: ${PORT}`))