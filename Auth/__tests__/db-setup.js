const mongoose = require('mongoose');

/**
 * Test Database Setup
 * This file handles connecting to a test MongoDB database
 * You can use either:
 * 1. A separate test database URI (recommended for CI/CD)
 * 2. MongoDB Memory Server (for local development)
 */

// Get the test database URI from environment or use a local test database
const getTestDbUri = () => {
    if (process.env.TEST_MONGODB_URI) {
        return process.env.TEST_MONGODB_URI;
    }
    // Fallback to local MongoDB test database
    return 'mongodb://localhost:27017/karobar-auth-test';
};

const TEST_DB_URI = getTestDbUri();

/**
 * Connect to test database before tests run
 */
module.exports.connect = async () => {
    try {
        await mongoose.connect(TEST_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to test database:', TEST_DB_URI);
    } catch (error) {
        console.error('Error connecting to test database:', error);
        throw error;
    }
};

/**
 * Clear all test data from database
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

/**
 * Close database connection after tests
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

/**
 * Drop a specific collection
 */
module.exports.dropCollection = async (collectionName) => {
    if (mongoose.connection.collections[collectionName]) {
        await mongoose.connection.collections[collectionName].deleteMany({});
    }
};
