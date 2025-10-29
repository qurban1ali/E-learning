import mongoose from "mongoose";
require('dotenv').config()

// DB_URL add
const dbUrl = process.env.DB_URL || "";

//Connect files
export const connectDB = async () => {
  try {
    console.log("🟡 Connecting to MongoDB...");
    console.log("🔗 DB_URL:", dbUrl);
    await mongoose.connect(dbUrl);
    console.log("✅ Database connected successfully");
  } catch (error: any) {
    console.error("❌ DB connection error:", error.message);
  }
};

export default connectDB;
