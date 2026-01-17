import express from 'express';
import SiteStats from '../models/SiteStats.js';

const router = express.Router();

// Increment visit count
router.post('/visit', async (req, res) => {
    try {
        const stats = await SiteStats.findOneAndUpdate(
            { identifier: 'main' },
            { $inc: { views: 1 }, lastUpdated: Date.now() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json({ views: stats.views });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Error tracking visit' });
    }
});

export default router;
