import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage',
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usageLimit: {
        type: Number,
        default: null, // Unlimited if null
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    applicableType: {
        type: String,
        enum: ['all', 'product', 'collection'],
        default: 'all',
    },
    applicableIds: [{
        type: String, // Product IDs or Collection Names (e.g., 'trinkets', 'pins')
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
