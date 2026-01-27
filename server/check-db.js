import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/destiny_shop';

console.log('Testing MongoDB Connection...');
console.log('URI:', MONGODB_URI);

const testConnection = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully.');

        const count = await Product.countDocuments();
        console.log(`✅ Database contains ${count} products.`);

        const product = await Product.findOne();
        if (product) {
            console.log('✅ Successfully fetched a product:', product.title);
        } else {
            console.log('⚠️ No products found in database.');
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

testConnection();
