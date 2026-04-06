require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ideasRouter = require('./routes/ideas')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/idea-validator')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err))

app.use('/ideas', ideasRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))