import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'

const app = express()
const Port = 8084

dotenv.config()

if (!process.env.dbURL) {
    throw new Error('Missing dbURL in server/.env')
}

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())

app.use('/customer', customerRoutes)
app.use('/products', productRoutes)

app.get('/', (req, res) => {
    res.send("Server is running")
})

const connectToDatabase = async () => {
    try {
        if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
            return
        }

        await mongoose.connect(process.env.dbURL, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log('DB Connected')
    } catch (err) {
        console.error(`Database connection failed: ${err.message}`)
        if (mongoose.connection.readyState !== 1) {
            console.log('Retrying database connection in 5 seconds...')
            setTimeout(connectToDatabase, 5000)
        }
    }
}

app.listen(Port, () => {
    console.log(`Server Started at ${Port}`)
    connectToDatabase()
})