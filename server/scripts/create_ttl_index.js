import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createTTLIndex = async () => {
    await connectDB();

    try {
        const collection = mongoose.connection.collection('users');

        // Check if index already exists
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        // Define the index name
        const indexName = "unverified_users_ttl";

        // Create the partial TTL index
        // Expire after 86400 seconds (24 hours) if isVerified is false
        await collection.createIndex(
            { "createdAt": 1 },
            {
                expireAfterSeconds: 86400,
                partialFilterExpression: { isVerified: false },
                name: indexName,
                background: true
            }
        );

        console.log('Success! Created TTL index for unverified users.');

        // Update existing users to be verified so they don't get deleted if we run this logic retroactively
        // (Though the partial filter usually handles new inserts, it's safe to update existing)
        const updateResult = await mongoose.connection.collection('users').updateMany(
            { isVerified: { $exists: false } }, // Find users without the field
            { $set: { isVerified: true } }      // Set them as verified
        );

        console.log(`Migrated ${updateResult.modifiedCount} existing users to isVerified: true`);

    } catch (error) {
        console.error('Error creating index:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createTTLIndex();
