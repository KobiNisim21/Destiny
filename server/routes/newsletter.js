import express from 'express';
import Subscriber from '../models/Subscriber.js';
import Content from '../models/Content.js';
import { sendNewsletterWelcome, sendCampaignEmail } from '../services/emailService.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Public: Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if already subscribed
        let subscriber = await Subscriber.findOne({ email });
        if (subscriber) {
            // If inactive, reactivate
            if (!subscriber.isActive) {
                subscriber.isActive = true;
                await subscriber.save();
                return res.json({ message: 'Welcome back! You have been resubscribed.' });
            }
            return res.status(400).json({ message: 'Email is already subscribed' });
        }

        // Create new subscriber
        subscriber = new Subscriber({ email });
        await subscriber.save();

        // Fetch welcome settings
        const subjectSetting = await Content.findOne({ key: 'marketingWelcomeSubject' });
        const bodySetting = await Content.findOne({ key: 'marketingWelcomeBody' });
        const couponSetting = await Content.findOne({ key: 'marketingCouponCode' });

        const subject = subjectSetting?.value;
        const body = bodySetting?.value;
        const couponCode = couponSetting?.value;

        console.log('Fetching welcome email settings:', {
            subject: subject ? 'Found' : 'Missing',
            body: body ? 'Found' : 'Missing',
            couponCode: couponCode ? 'Found' : 'Missing'
        });

        // Send welcome email (asynchronously)
        if (subject && body) {
            console.log('Attempting to send welcome email to:', email);
            sendNewsletterWelcome(email, subject, body, couponCode).then(result => {
                console.log('Welcome email execution result:', result);
            }).catch(err =>
                console.error('Failed to send welcome email:', err)
            );
        } else {
            console.log('Skipping welcome email: Subject or Body missing in Content settings.');
        }

        res.status(201).json({ message: 'Successfully subscribed!' });

    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all subscribers
router.get('/subscribers', isAdmin, async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Send Campaign
router.post('/send-campaign', isAdmin, async (req, res) => {
    try {
        const { subject, body } = req.body;

        if (!subject || !body) {
            return res.status(400).json({ message: 'Subject and body are required' });
        }

        // Get all active subscribers
        const subscribers = await Subscriber.find({ isActive: true });

        if (subscribers.length === 0) {
            return res.status(400).json({ message: 'No active subscribers found' });
        }

        console.log(`Starting campaign "${subject}" to ${subscribers.length} subscribers...`);

        // Send in batches to avoid overwhelming the server/SMTP
        let sentCount = 0;
        let diff = 0;
        const batchSize = 10;

        // We'll respond to the admin immediately that the process started
        res.json({ message: `Campaign started. Sending to ${subscribers.length} subscribers...` });

        // Process in background
        (async () => {
            for (let i = 0; i < subscribers.length; i += batchSize) {
                const batch = subscribers.slice(i, i + batchSize);
                await Promise.all(batch.map(sub => sendCampaignEmail(sub.email, subject, body)));
                sentCount += batch.length;
                console.log(`Sent ${sentCount}/${subscribers.length} emails`);

                // Small delay between batches
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log('Campaign finished.');
        })();

    } catch (error) {
        console.error('Send campaign error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

export default router;
