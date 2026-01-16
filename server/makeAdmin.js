import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const email = 'kobinisim22@gmail.com';

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`Success! User ${user.email} is now an ${user.role}.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
