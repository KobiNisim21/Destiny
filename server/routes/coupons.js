import express from 'express';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validate Coupon (Public/User)
router.post('/validate', async (req, res) => {
    try {
        const { code, cartItems } = req.body;

        if (!code) {
            return res.status(400).json({ valid: false, message: 'נא להזין קוד קופון' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ valid: false, message: 'קופון לא נמצא או לא פעיל' });
        }

        // Check Expiration
        if (new Date() > coupon.expirationDate) {
            return res.status(400).json({ valid: false, message: 'תוקף הקופון פג' });
        }

        // Check Usage Limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ valid: false, message: 'הקופון הגיע למכסת השימוש' });
        }

        // Fetch full product details for verification
        const productIds = cartItems.map(item => item.productId);
        const dbProducts = await Product.find({ _id: { $in: productIds } });

        // Map DB products for easy lookup
        const dbProductsMap = {};
        dbProducts.forEach(p => dbProductsMap[p._id.toString()] = p);

        let applicableTotal = 0;
        let validItemsCount = 0;

        // Calculate applicable total
        cartItems.forEach(item => {
            const dbProduct = dbProductsMap[item.productId];
            if (!dbProduct) return; // Skip if product not found in DB

            let isApplicable = false;

            if (coupon.applicableType === 'all') {
                isApplicable = true;
            } else if (coupon.applicableType === 'product') {
                if (coupon.applicableIds.includes(item.productId)) {
                    isApplicable = true;
                }
            } else if (coupon.applicableType === 'collection') {
                // Check if product section matches one of the applicable IDs (which are section names)
                // Also check 'category' if needed, but per plan we use 'section' (trinkets, pins)
                if (coupon.applicableIds.includes(dbProduct.section) || coupon.applicableIds.includes(dbProduct.category)) {
                    isApplicable = true;
                }
            }

            if (isApplicable) {
                applicableTotal += (dbProduct.price * item.quantity);
                validItemsCount++;
            }
        });

        if (applicableTotal === 0) {
            return res.status(400).json({ valid: false, message: 'הקופון אינו תקף למוצרים שבסל' });
        }

        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (applicableTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
            if (discountAmount > applicableTotal) discountAmount = applicableTotal;
        }

        res.json({
            valid: true,
            code: coupon.code,
            discountAmount: discountAmount,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            message: 'קופון הופעל בהצלחה'
        });

    } catch (error) {
        console.error('Coupon validation error:', error);
        res.status(500).json({ valid: false, message: 'שגיאת שרת' });
    }
});

// Admin: List Coupons
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Create Coupon
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { code, discountType, discountValue, expirationDate, applicableType, applicableIds } = req.body;

        const existingCookie = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCookie) {
            return res.status(400).json({ message: 'קוד קופון כבר קיים' });
        }

        const newCoupon = new Coupon({
            code,
            discountType,
            discountValue,
            expirationDate,
            applicableType,
            applicableIds
        });

        await newCoupon.save();
        res.status(201).json(newCoupon);

    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Delete Coupon
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
