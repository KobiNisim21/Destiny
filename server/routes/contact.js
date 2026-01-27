import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendContactEmail } from '../services/emailService.js';

const router = express.Router();

// Strict rate limiter for contact form: 3 emails per hour per IP
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { message: 'Too many messages sent from this IP, please try again after an hour' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', contactLimiter, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const fullName = `${firstName} ${lastName}`;
        const result = await sendContactEmail(fullName, email, message, phone);

        if (result.success) {
            res.status(200).json({ message: 'Message sent successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send message' });
        }
    } catch (error) {
        console.error('Contact API Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
