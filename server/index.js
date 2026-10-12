import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import customerRoutes from './routes/customer.routes.js'

const app = express()
const Port = 9001

dotenv.config()

mongoose.connect(process.env.dbURL).then(()=>{
    console.log('DB connected')
}).catch((err)=>{
    console.log(err)
})

app.use(cookieParser())
app.use(express.json())

app.use('/customer', customerRoutes)

app.get('/', (req, res)=>{
    res.send("Helloooo")
})

app.listen(Port, ()=>{
    console.log('Server Started Successfully')
})