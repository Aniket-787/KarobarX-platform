const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const { connect, clearDatabase, closeDatabase } = require('./db-setup');

describe('POST /auth/register', () => {
    // Connect to test database before running tests
    beforeAll(async () => {
        await connect();
    });

    // Clear database after each test
    afterEach(async () => {
        await clearDatabase();
    });

    // Close database connection after all tests
    afterAll(async () => {
        await closeDatabase();
    });

    describe('Successful Registration', () => {
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

            // Verify response structure
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');

            // Verify user data
            expect(response.body.user).toEqual({
                id: expect.any(String),
                username: 'testuser',
                email: 'testuser@example.com'
            });

            // Verify user was saved to database
            const userInDb = await User.findOne({ username: 'testuser' });
            expect(userInDb).not.toBeNull();
            expect(userInDb.email).toBe('testuser@example.com');
            expect(userInDb.fullName.firstName).toBe('John');
            expect(userInDb.fullName.lastName).toBe('Doe');
        });

        test('should hash password correctly', async () => {
            const userData = {
                username: 'hashtest',
                email: 'hash@example.com',
                password: 'MySecurePassword123!',
                fullName: {
                    firstName: 'Jane',
                    lastName: 'Smith'
                }
            };

            await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            const userInDb = await User.findOne({ username: 'hashtest' });
            // Password should not be plain text
            expect(userInDb.password).not.toBe('MySecurePassword123!');
            // Password should exist
            expect(userInDb.password).toBeDefined();
        });

        test('should return JWT token', async () => {
            const userData = {
                username: 'tokentest',
                email: 'token@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'Token',
                    lastName: 'User'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.token).toBeDefined();
            // Token should be a string
            expect(typeof response.body.token).toBe('string');
            // Token should have JWT format (three parts separated by dots)
            expect(response.body.token.split('.').length).toBe(3);
        });
    });

    describe('Validation Errors', () => {
        test('should reject registration without username', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'Please provide all required fields');
        });

        test('should reject registration without email', async () => {
            const userData = {
                username: 'testuser',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'Please provide all required fields');
        });

        test('should reject registration without password', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                fullName: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'Please provide all required fields');
        });

        test('should reject registration without fullName', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'TestPassword123!'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'Please provide all required fields');
        });

        test('should reject registration without firstName', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'TestPassword123!',
                fullName: {
                    lastName: 'Doe'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'Please provide all required fields');
        });

        test('should reject registration without lastName', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'John'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'Please provide all required fields');
        });
    });

    describe('Duplicate User Errors', () => {
        beforeEach(async () => {
            // Create a user before each test
            const userData = {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'Existing',
                    lastName: 'User'
                }
            };

            await request(app)
                .post('/auth/register')
                .send(userData);
        });

        test('should reject duplicate username', async () => {
            const userData = {
                username: 'existinguser',
                email: 'newemail@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'New',
                    lastName: 'User'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(409);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toBe('Username or email already exists');
        });

        test('should reject duplicate email', async () => {
            const userData = {
                username: 'newuser',
                email: 'existing@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'New',
                    lastName: 'User'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(409);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toBe('Username or email already exists');
        });

        test('should allow different username and email', async () => {
            const userData = {
                username: 'differentuser',
                email: 'different@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'Different',
                    lastName: 'User'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.user.username).toBe('differentuser');
        });
    });

    describe('Request Content-Type', () => {
        test('should accept JSON content type', async () => {
            const userData = {
                username: 'jsonuser',
                email: 'json@example.com',
                password: 'TestPassword123!',
                fullName: {
                    firstName: 'JSON',
                    lastName: 'User'
                }
            };

            const response = await request(app)
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
        });
    });
});
