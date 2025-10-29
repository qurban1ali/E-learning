"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// DB_URL add
const dbUrl = process.env.DB_URL || "";
//Connect files
const connectDB = async () => {
    try {
        console.log("🟡 Connecting to MongoDB...");
        console.log("🔗 DB_URL:", dbUrl);
        await mongoose_1.default.connect(dbUrl);
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ DB connection error:", error.message);
        setTimeout(exports.connectDB, 5000);
    }
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
