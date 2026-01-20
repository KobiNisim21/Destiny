import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env from root if not found
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const uri = process.env.MONGODB_URI;

console.log('--- MongoDB Connection Test ---');
console.log('CWD:', process.cwd());
console.log('URI found:', uri ? 'YES' : 'NO');

if (uri) {
    console.log('URI (masked):', uri.replace(/:([^:@]{1,})@/, ':****@'));
} else {
    console.error('ERROR: MONGODB_URI is missing from process.env');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        console.log('Database Name:', mongoose.connection.name);
        return mongoose.connection.close();
    })
    .then(() => {
        console.log('Connection closed.');
        process.exit(0);
    })
    .catch(err => {
        console.error('CONNECTION FAILED:');
        console.error(err.message);
        if (err.message.includes('Authentication failed')) {
            console.error('-> Hint: Check username (destiny_db_user) and password.');
        } else if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT')) {
            console.error('-> Hint: Check internet connection or IP whitelist in MongoDB Atlas.');
        }
        process.exit(1);
    });
