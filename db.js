const { MongoClient } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);

// Database name
const dbName = 'vestas';

let db;

async function connectDB() {
    if (!db) {
        try {
            await client.connect();
            console.log('Connected to MongoDB');
            db = client.db(dbName);
        } catch (err) {
            console.error('Could not connect to MongoDB', err);
            process.exit(1); // Exit process with failure
        }
    }
    return db;
}

async function getCollection(collectionName) {
    const database = await connectDB();
    return database.collection(collectionName);
}

module.exports = {
    getCollection,
};
