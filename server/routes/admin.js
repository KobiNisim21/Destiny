import express from 'express';
import mongoose from 'mongoose';
import { isAdmin } from '../middleware/adminAuth.js';
import SiteStats from '../models/SiteStats.js';

const router = express.Router();

// Get Dashboard Stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        console.log('GET /api/admin/stats requested');

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrevMonth = startOfMonth;

        const usersThisMonth = await mongoose.model('User').countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        const usersPrevMonth = await mongoose.model('User').countDocuments({
            createdAt: { $gte: startOfPrevMonth, $lt: endOfPrevMonth }
        });

        // Calculate percentage change
        let userGrowth = 0;
        if (usersPrevMonth > 0) {
            userGrowth = ((usersThisMonth - usersPrevMonth) / usersPrevMonth) * 100;
        } else if (usersThisMonth > 0) {
            userGrowth = 100; // 100% growth if started from 0
        }

        const productsCount = await mongoose.model('Product').countDocuments();

        let stats = {};
        try {
            stats = await mongoose.connection.db.stats();
        } catch (dbError) {
            console.error('MongoDB Stats Error:', dbError);
            // Fallback for storage if permission denied
            stats = { storageSize: null, dataSize: null };
        }

        const siteStats = await SiteStats.findOne({ identifier: 'main' });

        res.json({
            users: usersThisMonth,
            userGrowth: userGrowth.toFixed(1),
            usersPrevMonth: usersPrevMonth,
            products: productsCount,
            orders: 0,
            views: siteStats ? siteStats.views : 0,
            dbName: stats.db || 'destiny_shop',
            storageSize: stats.storageSize || 0,
            dataSize: stats.dataSize || 0
        });
    } catch (error) {
        console.error('Stats error details:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

export default router;
