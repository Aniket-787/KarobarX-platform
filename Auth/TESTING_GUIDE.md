# Auth Service - Jest Testing Setup

## Overview
This setup includes comprehensive Jest tests for the `/auth/register` endpoint with a separate test MongoDB database to avoid flooding the original database.

## Project Structure
```
Auth/
├── src/
│   ├── app.js                 (Express app)
│   ├── controllers/
│   │   └── authController.js  (Registration logic)
│   ├── routes/
│   │   └── authRoutes.js      (Route definitions)
│   ├── models/
│   │   └── user.model.js      (User schema)
│   └── db/
│       └── db.js              (Database connection)
├── __tests__/
│   ├── auth.register.test.js  (Main test file)
│   ├── db-setup.js            (Test database utilities)
│   └── setup.js               (Jest setup configuration)
├── jest.config.js              (Jest configuration)
├── .env                        (Production environment variables)
├── .env.test                   (Test environment variables)
└── package.json                (Project dependencies)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `jest`: Testing framework
- `supertest`: HTTP assertion library for testing Express APIs
- Existing dependencies: `mongoose`, `bcrypt`, `jsonwebtoken`, etc.

### 2. Configure Test Database

The test uses a separate MongoDB database to keep data isolated. Choose one of these options:

#### Option A: Local MongoDB (Recommended for Development)
1. Ensure MongoDB is running locally on `mongodb://localhost:27017`
2. The tests will automatically use the `karobar-auth-test` database
3. No changes needed - `.env.test` is already configured

#### Option B: Remote MongoDB Test Database
1. Create a separate database on MongoDB Atlas for testing (e.g., `karobar-auth-test`)
2. Update `.env.test`:
   ```
   TEST_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/karobar-auth-test
   ```

#### Option C: MongoDB Memory Server (Optional)
For an in-memory database that requires no installation:
1. Install package: `npm install --save-dev mongodb-memory-server`
2. Modify `__tests__/db-setup.js` to use MongoDB Memory Server instead

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```
This reruns tests whenever files change, useful during development.

### Run Specific Test File
```bash
npm test -- auth.register.test.js
```

### Run Tests Matching a Pattern
```bash
npm test -- --testNamePattern="Successful Registration"
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## Test Coverage

The test suite includes:

### ✅ Successful Registration (3 tests)
- Register new user successfully
- Password hashing verification
- JWT token generation

### ✅ Validation Errors (6 tests)
- Missing username
- Missing email
- Missing password
- Missing fullName object
- Missing firstName
- Missing lastName

### ✅ Duplicate User Errors (3 tests)
- Duplicate username detection
- Duplicate email detection
- Allowing different username and email

### ✅ Request Handling (1 test)
- Proper JSON content-type handling

**Total: 13 comprehensive tests**

## Understanding the Test Database Setup

### `db-setup.js`
Provides utilities for test database management:
```javascript
- connect()         : Connect to test database
- clearDatabase()   : Remove all data between tests
- closeDatabase()   : Disconnect and clean up after tests
- dropCollection()  : Clear specific collections
```

### How Tests Work
1. **Before All Tests**: Connect to test database
2. **Before Each Test**: Clean database (via `afterEach`)
3. **Run Test**: Execute test logic
4. **After All Tests**: Close database connection

This ensures:
- Tests run in isolation
- No data persists between tests
- Original database remains untouched
- Clean database state for each test

## Test Examples

### Example 1: Successful Registration
```javascript
test('should register a new user successfully', async () => {
    const userData = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'TestPassword123!',
        fullName: {
            firstName: 'John',
            lastName: 'Doe'
        }
    };

    const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user.username).toBe('testuser');
});
```

### Example 2: Duplicate Username Check
```javascript
test('should reject duplicate username', async () => {
    // First user created in beforeEach
    const newUser = { /* different email */ };
    
    const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(409);

    expect(response.body.message).toBe('Username or email already exists');
});
```

## Troubleshooting

### Tests Timeout
- Ensure MongoDB is running
- Increase timeout in `jest.config.js`: Change `testTimeout: 10000` to higher value

### "Cannot connect to MongoDB"
- Check MongoDB connection string in `.env.test`
- Verify MongoDB service is running
- For local: `mongod` should be running
- For Atlas: Check IP whitelist and credentials

### Tests Pass Locally but Fail in CI/CD
- Use MongoDB Memory Server or separate test database URI in CI environment
- Set `TEST_MONGODB_URI` environment variable in CI pipeline

### Port 3000 Already in Use
- Tests use the Express app without binding to a port
- This shouldn't be an issue, but if needed, modify test configuration

## CI/CD Integration

For GitHub Actions or other CI systems:
```yaml
# Example GitHub Actions workflow
env:
  TEST_MONGODB_URI: mongodb://localhost:27017/karobar-auth-test

services:
  mongodb:
    image: mongo:latest
    options: >-
      --health-cmd "mongosh --eval 'db.runCommand("ping")'"
```

Then run: `npm test`

## Next Steps

1. **Add More Endpoints**: Create similar test files for login, logout, etc.
2. **Add Integration Tests**: Test multiple endpoints together
3. **Add E2E Tests**: Use tools like Cypress for full application testing
4. **Code Coverage**: Monitor coverage metrics and aim for >80% coverage

## Files Modified/Created

| File | Status | Purpose |
|------|--------|---------|
| `src/controllers/authController.js` | Created | Register user logic |
| `src/routes/authRoutes.js` | Created | Route definitions |
| `src/app.js` | Updated | Added route middleware |
| `__tests__/auth.register.test.js` | Created | 13 comprehensive tests |
| `__tests__/db-setup.js` | Created | Database utilities |
| `__tests__/setup.js` | Created | Jest configuration |
| `jest.config.js` | Created | Jest settings |
| `.env.test` | Created | Test database config |
| `package.json` | Updated | Added jest & supertest |

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Testing Best Practices](https://docs.mongodb.com/manual/)
- [Express Testing Guide](https://expressjs.com/en/guide/testing.html)
