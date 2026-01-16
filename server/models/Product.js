import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
    },
    category: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        enum: ['featured', 'trinkets', 'pins', 'none'], // 'none' for general products
        default: 'none'
    },
    displaySlot: {
        type: Number,
        min: 1,
        max: 4,
        default: null // null means not assigned to a specific cube (list only)
    },
    mainImage: {
        type: String,
        required: true,
    },
    hoverImage: {
        type: String, // Optional
    },
    galleryImages: [{
        type: String, // Optional
    }],
    // Deprecated but kept for temporary safety if needed, though we will stop writing to it
    images: [{
        type: String,
    }],
    inStock: {
        type: Boolean,
        default: true,
    },
    isNewArrival: {
        type: Boolean,
        default: false,
    },
    faq: [{
        question: String,
        answer: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
