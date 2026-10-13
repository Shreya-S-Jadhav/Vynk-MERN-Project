import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from './model/product.model.js'

dotenv.config()

const sampleProducts = [
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'Full-sized mechanical keyboard with tactile switches, RGB backlighting, and a detachable wrist rest.',
        price: 3499,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
        stock: 15
    },
    {
        name: 'Noise Cancelling Wireless Headphones',
        description: 'Over-ear Bluetooth headphones with active noise cancellation and a 40-hour battery life.',
        price: 6999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: 22
    },
    {
        name: 'Ergonomic Wireless Mouse',
        description: 'Precision wireless mouse with silent clicks, rechargeable USB-C power, and an ergonomic shape.',
        price: 1499,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        stock: 30
    },
    {
        name: 'Smart Fitness Watch',
        description: 'AMOLED fitness watch with heart-rate monitoring, multi-sport tracking, and a seven-day battery.',
        price: 4299,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        stock: 8
    },
    {
        name: 'Classic Denim Jacket',
        description: 'Medium-wash cotton denim jacket with reinforced buttons and double chest pockets.',
        price: 2499,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
        stock: 18
    },
    {
        name: 'Breathable Running Sneakers',
        description: 'Lightweight running shoes with shock-absorbing midsoles and high-grip rubber outsoles.',
        price: 3299,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        stock: 12
    },
    {
        name: 'Minimalist Polarized Sunglasses',
        description: 'Matte black sunglasses with UV400 polarized lenses and scratch resistance.',
        price: 1199,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        stock: 25
    },
    {
        name: 'Designing Data-Intensive Applications',
        description: 'A practical guide to the architecture, scalability, reliability, and maintainability of modern data systems.',
        price: 1899,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        stock: 14
    },
    {
        name: 'Atomic Habits',
        description: 'A practical framework for building good habits and breaking bad ones through small daily changes.',
        price: 599,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        stock: 40
    },
    {
        name: 'Clean Code',
        description: 'A software engineering guide to writing readable, reusable, and testable code.',
        price: 1499,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        stock: 19
    },
    {
        name: 'Ceramic Aroma Diffuser',
        description: 'Whisper-quiet essential oil diffuser with warm ambient light and automatic shutoff.',
        price: 2199,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        stock: 16
    },
    {
        name: 'Gooseneck Pour-Over Kettle',
        description: 'Precision flow spout with an integrated thermometer, wood-finish handle, and rapid-heating base.',
        price: 2799,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        stock: 10
    }
]

try {
    if (!process.env.dbURL) throw new Error('Missing dbURL in server/.env')
    await mongoose.connect(process.env.dbURL)
    await Product.deleteMany({})
    const insertedProducts = await Product.insertMany(sampleProducts)
    console.log(`Successfully seeded ${insertedProducts.length} products.`)
} catch (error) {
    console.error(`Seeding failed: ${error.message}`)
    process.exitCode = 1
} finally {
    await mongoose.disconnect()
}