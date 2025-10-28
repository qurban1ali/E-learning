import mongoose from "mongoose";
require('dotenv').config();

const dbUrl:string = process.env.DB_URL || 'mongodb+srv://qa6657467_db_user:KZybWw9DCSiLOwBm@lms-data.1htcr4r.mongodb.net/?appName=lms-data';

const connectDB = async()=>{
    try {
        await mongoose.connect(dbUrl).then((data:any) => {
            console.log(`Database connected with ${data.connection.host}`);
        }) 
    } catch (error:any) {
        console.log(error.message)
        setTimeout(connectDB, 5000)
    }
}

export default connectDB;