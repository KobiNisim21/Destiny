import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/admin.js';
import teamRoutes from './routes/team.js';
import analyticsRoutes from './routes/analytics.js';
import orderRoutes from './routes/orders.js';
import couponRoutes from './routes/coupons.js';
import youtubeRoutes from './routes/youtube.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import paymentRoutes from './routes/payments.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the root directory (one level up)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '../.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware Information
// Rate Limiting: Prevents Brute Force/DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb to 10mb prevents DoS
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Apply Security Middleware
app.use('/api', limiter); // Apply rate limiting to API routes
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors()); // In production, replace with specific origin: { origin: 'https://yourdomain.com' }

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

// MongoDB Connection
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/destiny_shop';

let isConnected = false; // Track connection status

export const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('Connected to MongoDB');
        console.log('Using DB:', MONGODB_URI.includes('localhost') ? 'Localhost' : 'Atlas Cloud');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err; // Re-throw to handle in caller
    }
};

// Start server only if not in production (Vercel handles the server in prod)
if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

export default app;
