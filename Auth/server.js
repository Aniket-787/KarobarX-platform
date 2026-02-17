const app = require('./src/app');
const connectDB = require('./src/db/db');
require('dotenv').config();

connectDB();


app.listen(3000,()=>{
    console.log("Auth Service is running on the port 3000")
})

