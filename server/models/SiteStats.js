import mongoose from 'mongoose';

const siteStatsSchema = new mongoose.Schema({
    identifier: { type: String, required: true, unique: true, default: 'main' }, // explicit identifier for singleton
    views: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

const SiteStats = mongoose.model('SiteStats', siteStatsSchema);

export default SiteStats;
