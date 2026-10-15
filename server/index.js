import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'

dotenv.config()

const app = express()
const Port = process.env.PORT || 8084

// Flexible CORS for local development, Vercel deployments, and same-origin requests
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || 
            origin.startsWith('http://localhost:') || 
            origin.endsWith('.vercel.app') || 
            (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)) {
            callback(null, true)
        } else {
            callback(null, true)
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())

// Database connection helper with connection caching for serverless environments
let isConnecting = false
const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        return
    }

    if (isConnecting) return

    isConnecting = true
    try {
        if (!process.env.dbURL) {
            console.error('Warning: dbURL environment variable is not defined')
            return
        }
        await mongoose.connect(process.env.dbURL, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log('DB Connected')
    } catch (err) {
        console.error(`Database connection failed: ${err.message}`)
    } finally {
        isConnecting = false
    }
}

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
    await connectToDatabase()
    next()
})

// Sub-router containing all application routes
const apiRouter = express.Router()

apiRouter.use('/customer', customerRoutes)
apiRouter.use('/products', productRoutes)
apiRouter.use('/wishlist', wishlistRoutes)
apiRouter.use('/cart', cartRoutes)
apiRouter.use('/orders', orderRoutes)

apiRouter.get('/', (req, res) => {
    res.send("Server is running")
})

// Mount routes on /api (for Vercel rewrites) and / (for direct calls/local dev)
app.use('/api', apiRouter)
app.use('/', apiRouter)

// When running locally outside of Vercel serverless environment, start listener
if (process.env.VERCEL !== '1') {
    app.listen(Port, () => {
        console.log(`Server Started at ${Port}`)
        connectToDatabase()
    })
}

export default app