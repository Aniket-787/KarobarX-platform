module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup/globalSetup.js'],
  testTimeout: 10000,
  detectOpenHandles: true,
  forceExit: true,
};
