import { app } from "./app";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./utils/db";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const server = http.createServer(app);

// ✅ Connect to MongoDB FIRST, then start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
