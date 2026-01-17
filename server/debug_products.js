import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from current directory
dotenv.config();

const run = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/destiny_shop';
        console.log('Connecting to:', mongoUri);

        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        console.log('Fetching products...');
        const products = await Product.find().limit(5);
        console.log('Products found:', products.length);
        console.log('Sample:', products[0]);

        process.exit(0);
    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        process.exit(1);
    }
};

run();
