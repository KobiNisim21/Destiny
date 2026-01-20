import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

console.log('--- DB DIAGNOSTIC START ---');
console.log('Target URI (masked):', uri.replace(/:([^:@]{1,})@/, ':****@').split('?')[0]);

async function diagnose() {
    try {
        const conn = await mongoose.connect(uri);
        console.log('Connected successfully.');

        // 1. List all databases
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const dbs = await admin.listDatabases();
        console.log('\nAvailable Databases:');
        dbs.databases.forEach(db => console.log(` - ${db.name} (Size: ${db.sizeOnDisk})`));

        // 2. Check current DB
        console.log(`\nCurrent Database: ${mongoose.connection.db.databaseName}`);

        // 3. List collections in current DB
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in current DB:');
        if (collections.length === 0) console.log(' (None - The database is empty)');

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count} documents`);
        }

        // 4. Check for 'users' specifically
        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        if (userCount === 0) {
            console.log('\nCRITICAL: "users" collection is empty!');
        } else {
            const user = await mongoose.connection.db.collection('users').findOne({ email: 'kobinisim22@gmail.com' });
            console.log('\nChecking for kobinisim22@gmail.com:');
            console.log(user ? ' -> FOUND!' : ' -> NOT FOUND');
        }

    } catch (err) {
        console.error('Diagnostic failed:', err);
    } finally {
        await mongoose.connection.close();
        console.log('--- DB DIAGNOSTIC END ---');
        process.exit(0);
    }
}

diagnose();
