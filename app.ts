require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";

// 1️⃣ Body parser
app.use(express.json({ limit: "50mb" }));

// 2️⃣ Cookie parser
app.use(cookieParser());

// 3️⃣ CORS
const allowedOrigins = [
  "https://e-learning-client-theta.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 4️⃣ Handle OPTIONS preflight
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// 5️⃣ Rate limiter — must be before routes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // ✅ 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// 6️⃣ Routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// 7️⃣ Test route
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API is working" });
});

// // 8️⃣ Unknown route
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   const error: any = new Error(`Route ${req.originalUrl} not found`);
//   error.statusCode = 404;
//   next(error);
// });

// 9️⃣ Error middleware
app.use(ErrorMiddleware);
