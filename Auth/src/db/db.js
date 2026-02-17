const mongoose = require('mongoose');


let connectDB = async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected sucessfully");       
    } catch (error) {
       log("Error connecting to MongoDB",error); 
    }
}


module.exports = connectDB;