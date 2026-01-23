import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '../services/emailService.js';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Create New Order
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        const newOrder = new Order({
            user: req.user.id,
            items,
            totalAmount,
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
                    items,
                    totalAmount
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
                        totalAmount
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
