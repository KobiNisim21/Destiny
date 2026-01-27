import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/payments/initialize
 * @desc    Initialize a payment transaction
 * @access  Private
 */
router.post('/initialize', verifyToken, async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Security Check: Ensure the order belongs to the requesting user
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to pay for this order' });
        }

        // Prepare Payment Gateway Parameters (Mock logic for Isracard/Tranzila etc.)
        const terminalNumber = process.env.PAYMENT_TERMINAL_NUMBER || '1234567';
        const amount = order.totalAmount;
        const currency = 'ILS';

        // Generate a secure signature to prevent tampering
        // In a real scenario, this would use the gateway's secret key
        const signatureString = `${terminalNumber}${order._id}${amount}${currency}`; // Simplified
        const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

        // Check if payment is already completed
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Order is already paid' });
        }

        res.json({
            paymentUrl: 'https://direct.tranzila.com/geu/wait', // Example URL
            params: {
                terminal: terminalNumber,
                sum: amount,
                currency: currency,
                orderId: order._id,
                signature: signature
            }
        });

    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({ message: 'Server error initializing payment' });
    }
});

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle IPN (Instant Payment Notification) from Gateway
 * @access  Public (Protected by Signature)
 */
router.post('/webhook', async (req, res) => {
    try {
        // In a real implementation, you MUST verify the signature from the POST body
        // const { signature, ...data } = req.body;
        // Verify signature matches expected value based on secret key

        // Mock verification for this phase
        const { orderId, success } = req.body;

        if (!orderId) {
            return res.status(400).send('Missing Order ID');
        }

        if (success === 'true' || success === true) {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'paid';
                // order.transactionId = req.body.transactionId; // If available
                await order.save();
                console.log(`Payment confirmed for Order ${orderId}`);
            }
        } else {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentStatus = 'failed';
                await order.save();
            }
        }

        res.status(200).send('OK');

    } catch (error) {
        console.error('Payment webhook error:', error);
        res.status(500).send('Error processing webhook');
    }
});

export default router;
