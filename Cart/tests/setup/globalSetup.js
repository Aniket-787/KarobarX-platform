// Global test setup for Cart service
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

// Optionally could set NODE_ENV
// no Jest lifecycle hooks here since this runs before the test framework initializes