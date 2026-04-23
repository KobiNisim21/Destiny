import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        const email = 'kobinisim22@gmail.com';
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
             console.log(`⚠️ User with email ${email} already exists! Skipping creation.`);
        } else {
             console.log(`Creating Super Admin: ${email}...`);
             const targetPassword = 'AdminPassword123!';
             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(targetPassword, salt);

             const superAdmin = new User({
                 firstName: 'Kobi',
                 lastName: 'Nisim',
                 email: email,
                 password: hashedPassword,
                 role: 'admin',
                 isSuperAdmin: true,
                 isVerified: true,
                 permissions: [
                     'manage_products',
                     'manage_orders', 
                     'manage_content', 
                     'manage_team', 
                     'view_dashboard'
                 ]
             });

             await superAdmin.save();
             console.log(`✅ Super Admin created successfully!`);
             console.log(`Email: ${email}`);
             console.log(`Password: ${targetPassword}`);
        }

        mongoose.connection.close();
        console.log('✅ Seed completed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
