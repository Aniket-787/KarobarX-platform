// Setup file for all tests
// This file runs before each test suite
require('dotenv').config({ path: '.env.test' });

// Increase timeout for database operations
jest.setTimeout(10000);

// Suppress console logs during tests (optional)
// global.console.log = jest.fn();
// global.console.error = jest.fn();
