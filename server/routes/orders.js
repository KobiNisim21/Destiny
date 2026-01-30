import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js'; // Import Product model
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '../services/emailService.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, orderSchema } from '../middleware/validate.js';

const router = express.Router();

// Create New Order
router.post('/', verifyToken, validateRequest(orderSchema), async (req, res) => {
    try {
        const { items, shippingAddress } = req.body; // Removed totalAmount from destructuring

        // Server-side price calculation
        let calculatedTotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product || item._id); // Handle both formats if needed, usually item.product is the ID ref
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }

            // Verify price from DB
            const itemTotal = product.price * item.quantity;
            calculatedTotal += itemTotal;

            verifiedItems.push({
                ...item,
                price: product.price, // Force DB price
                productId: product._id // Mapped to productId as expected by Mongoose model
            });
        }

        const newOrder = new Order({
            user: req.user.id,
            items: verifiedItems,
            totalAmount: calculatedTotal, // Use server-calculated total
            shippingAddress,
            paymentStatus: 'paid', // Mocking payment success for now
            status: 'processing'
        });

        const savedOrder = await newOrder.save();

        // 1. Send confirmation to user
        User.findById(req.user.id).then(user => {
            if (user && user.email) {
                sendOrderConfirmationEmail(
                    user.email,
                    user.firstName || shippingAddress.firstName,
                    savedOrder._id.toString(),
                    verifiedItems,
                    calculatedTotal
                ).catch(err => console.error('Failed to send order email:', err));
            }
        });

        // 2. Notify Admins
        User.find({ role: 'admin' }).then(admins => {
            admins.forEach(admin => {
                if (admin.email) {
                    sendAdminNewOrderNotification(
                        admin.email,
                        savedOrder._id.toString(),
                        `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                        calculatedTotal
                    ).catch(err => console.error('Failed to notify admin:', err));
                }
            });
        });

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
});

// Get My Orders
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Get All Orders (Admin)
router.get('/admin', verifyToken, async (req, res) => {
    try {
        // Verify admin role from DB to be safe
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const orders = await Order.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
});

// Update Order Status (Admin)
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        // Verify admin role from DB to be safe
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

export default router;
