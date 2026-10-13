import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
        default: ''
    },

    shippingAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: '' }
    },


    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Customer = mongoose.model('Customer', customerSchema)

export default Customer