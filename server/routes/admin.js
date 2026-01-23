import express from 'express';
import mongoose from 'mongoose';
import { isAdmin } from '../middleware/adminAuth.js';
import SiteStats from '../models/SiteStats.js';

const router = express.Router();

// Get Dashboard Stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrevMonth = startOfMonth;

        // User Stats
        const usersThisMonth = await mongoose.model('User').countDocuments({ createdAt: { $gte: startOfMonth } });
        const usersPrevMonth = await mongoose.model('User').countDocuments({ createdAt: { $gte: startOfPrevMonth, $lt: endOfPrevMonth } });

        let userGrowth = 0;
        if (usersPrevMonth > 0) userGrowth = ((usersThisMonth - usersPrevMonth) / usersPrevMonth) * 100;
        else if (usersThisMonth > 0) userGrowth = 100;

        // Product Count
        const productsCount = await mongoose.model('Product').countDocuments();

        // Order Stats
        const orders = await mongoose.model('Order').find({ status: { $ne: 'cancelled' } });
        const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Recent Orders
        const recentOrders = await mongoose.model('Order').find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'firstName lastName email');

        // DB Stats
        let dbStats = {};
        try { dbStats = await mongoose.connection.db.stats(); } catch (e) { }

        const siteStats = await SiteStats.findOne({ identifier: 'main' });

        res.json({
            users: usersThisMonth,
            userGrowth: userGrowth.toFixed(1),
            products: productsCount,
            totalSales: totalSales,
            recentOrders: recentOrders,
            views: siteStats ? siteStats.views : 0,
            dbName: dbStats.db || 'destiny_shop',
            storageSize: dbStats.storageSize || 0
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

export default router;
