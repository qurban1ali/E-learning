"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
// 1️⃣ Body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
// 2️⃣ Cookie parser
exports.app.use((0, cookie_parser_1.default)());
// 3️⃣ CORS
const allowedOrigins = [
    "https://e-learning-client-theta.vercel.app",
    "http://localhost:3000"
];
exports.app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
// 4️⃣ Handle OPTIONS preflight
exports.app.options("*", (0, cors_1.default)({ origin: allowedOrigins, credentials: true }));
// 5️⃣ Rate limiter — must be before routes
exports.app.use((0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // ✅ 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
// 6️⃣ Routes
exports.app.use("/api/v1", user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, analytics_route_1.default, layout_route_1.default);
// 7️⃣ Test route
exports.app.get("/test", (req, res) => {
    res.status(200).json({ success: true, message: "API is working" });
});
// 8️⃣ Unknown route
exports.app.all("*", (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
});
// 9️⃣ Error middleware
exports.app.use(error_1.ErrorMiddleware);
