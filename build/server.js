"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const cloudinary_1 = require("cloudinary");
const db_1 = __importDefault(require("./utils/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
// Cloudinary Config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
const server = http_1.default.createServer(app_1.app);
// ✅ Connect to MongoDB FIRST, then start server
(0, db_1.default)()
    .then(() => {
    server.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
});
