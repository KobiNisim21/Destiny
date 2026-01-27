import express from 'express';
import Subscriber from '../models/Subscriber.js';
import Content from '../models/Content.js';
import { sendNewsletterWelcome, sendCampaignEmail, sendVerificationEmail } from '../services/emailService.js';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminAuth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        let subscriber = await Subscriber.findOne({ email });
        const verificationToken = uuidv4();

        if (subscriber) {
            if (subscriber.isActive && subscriber.isVerified) {
                return res.status(400).json({ message: 'Email already subscribed' });
            }

            // Reactivate or Re-verify logic
            subscriber.isActive = true; // Wait for verification technically, but we can set active and set unverified?
            // User requested: "Active only after approval". So isActive should be false or true?
            // Usually: Subscriber exists but isVerified=false.
            subscriber.isVerified = false;
            subscriber.verificationToken = verificationToken;
            await subscriber.save();
        } else {
            subscriber = new Subscriber({
                email,
                isActive: true, // They want to be active, but need verification
                isVerified: false,
                verificationToken
            });
            await subscriber.save();
        }

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
            console.log(`Verification email sent to ${email}`);
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        res.status(201).json({
            message: 'Verification email sent! Please check your inbox.',
            requireVerification: true
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify email
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;

        const subscriber = await Subscriber.findOne({ verificationToken: token });

        if (!subscriber) {
            return res.status(404).json({ message: 'Invalid or expired verification token' });
        }

        if (subscriber.isVerified) {
            return res.status(200).json({ message: 'Email already verified' });
        }

        subscriber.isVerified = true;
        // subscriber.verificationToken = undefined; // Optional: clear token or keep for records
        await subscriber.save();

        // Now send the welcome email with coupon
        // Fetch dynamic content
        const welcomeSubjectSetting = await Content.findOne({ key: 'marketingWelcomeSubject' });
        const welcomeBodySetting = await Content.findOne({ key: 'marketingWelcomeBody' });
        const couponSetting = await Content.findOne({ key: 'marketingCouponCode' });

        const subject = welcomeSubjectSetting?.value;
        const body = welcomeBodySetting?.value;
        const couponCode = couponSetting?.value;

        if (subject && body) {
            sendNewsletterWelcome(subscriber.email, subject, body, couponCode, subscriber._id).catch(err =>
                console.error('Failed to send welcome email after verification:', err)
            );
        }

        res.status(200).json({ message: 'Email verified successfully!' });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Unsubscribe
router.post('/unsubscribe', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Subscriber ID is required' });
        }

        const subscriber = await Subscriber.findById(id);
        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.status(200).json({ message: 'Unsubscribed successfully' });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete subscriber (Admin only)
router.delete('/subscribers/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Subscriber.findByIdAndDelete(id);
        res.status(200).json({ message: 'Subscriber removed successfully' });
    } catch (error) {
        console.error('Delete subscriber error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all subscribers (Admin only)
router.get('/subscribers', verifyToken, isAdmin, async (req, res) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Send campaign to all active subscribers (Admin only)
router.post('/send-campaign', verifyToken, isAdmin, async (req, res) => {
    try {
        const { subject, body } = req.body;

        if (!subject || !body) {
            return res.status(400).json({ message: 'Subject and body are required' });
        }

        // Find all active AND verified subscribers
        const subscribers = await Subscriber.find({ isActive: true, isVerified: true });

        // Respond immediately to admin
        res.json({ message: `Campaign started for ${subscribers.length} subscribers` });

        // Process in background
        const batchSize = 10;
        const delayBetweenBatches = 1000; // 1 second

        const sendBatch = async (batch) => {
            const promises = batch.map(sub =>
                sendCampaignEmail(sub.email, subject, body, sub._id)
                    .catch(err => console.error(`Failed to send to ${sub.email}:`, err))
            );
            await Promise.all(promises);
        };

        (async () => {
            for (let i = 0; i < subscribers.length; i += batchSize) {
                const batch = subscribers.slice(i, i + batchSize);
                await sendBatch(batch);
                if (i + batchSize < subscribers.length) {
                    await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                }
            }
            console.log('Campaign finished');
        })();

    } catch (error) {
        console.error('Send campaign error:', error);
        // If response not sent yet
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

export default router;
