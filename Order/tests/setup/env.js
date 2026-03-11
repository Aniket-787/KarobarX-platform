process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/test-db-skip-real';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'f27609fa3c5c82bb0ae8401af28b19c712ff71faffa7221a4a15441d27f7ecdc';
process.env.JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';