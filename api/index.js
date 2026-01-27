import app, { connectDB } from '../server/index.js';

export default async function handler(req, res) {
    // Vercel serverless function handler
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error('Failed to connect to DB:', error);
        return res.status(500).json({
            error: 'Database connection failed',
            details: error.message,
            uri_defined: !!process.env.MONGODB_URI,
            uri_prefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'undefined'
        });
    }
}
