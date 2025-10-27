import mongoose from "mongoose";
require('dotenv').config();

const dbUrl:string = 'mongodb+srv://qa6657467_db_user:JmM4jmnVUt8bMDEF@e-learning.faqbakn.mongodb.net/e-learning';

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