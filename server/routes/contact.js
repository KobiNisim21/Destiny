import express from 'express';
import { sendContactEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
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
