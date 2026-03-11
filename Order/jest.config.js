module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup/env.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/mongodb.js'],
  testTimeout: 10000,
  detectOpenHandles: true,
  forceExit: true,
};
