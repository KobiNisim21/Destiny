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

        // Order Stats logic
        const allNonCancelledOrders = await mongoose.model('Order').find({ status: { $ne: 'cancelled' } });

        // Calculate sales totals
        const totalSales = allNonCancelledOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const monthlySales = allNonCancelledOrders
            .filter(o => new Date(o.createdAt) >= startOfMonth)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const yearlySales = allNonCancelledOrders
            .filter(o => new Date(o.createdAt) >= startOfYear)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Sales Graph (Last 14 days)
        const salesGraph = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
            salesGraph.push({ name: dateStr, sales: 0 });
        }

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        allNonCancelledOrders.forEach(order => {
            const d = new Date(order.createdAt);
            if (d >= fourteenDaysAgo) {
                const dateStr = d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
                const entry = salesGraph.find(item => item.name === dateStr);
                if (entry) {
                    entry.sales += (order.totalAmount || 0);
                }
            }
        });

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
            totalSales,    // All time
            monthlySales,  // This month
            yearlySales,   // This year
            salesGraph,    // Graph data
            recentOrders,
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
