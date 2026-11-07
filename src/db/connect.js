import { MongoClient } from 'mongodb';

let db;

const connectToDb = async () => {
    if (db) {
        return db;
    }

    const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

    if (!MONGODB_URI || !MONGODB_DB_NAME) {
        throw new Error('MONGODB_URI and MONGODB_DB_NAME must be set.');
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB_NAME);

    return db;
};

const getDb = () => {
    if (!db) {
        throw new Error('Database is not connected. Call connectToDb() first.');
    }

    return db;
};

export { connectToDb, getDb };
