import express from 'express';
import mongoose from 'mongoose';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Get DB Stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const stats = await mongoose.connection.db.stats();
        res.json({
            dbName: stats.db,
            storageSize: stats.storageSize,
            dataSize: stats.dataSize,
            objects: stats.objects,
            indexes: stats.indexes,
            indexSize: stats.indexSize
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

export default router;
