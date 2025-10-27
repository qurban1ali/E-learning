require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import {rateLimit} from "express-rate-limit"

import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";



// ceate parser
app.use(cookieParser());

//cors => cross origin resource sharing

// ✅ Must come before routes
const allowedOrigins = [
  "https://e-learning-client-theta.vercel.app",
  "http://localhost:3000", // for local testing
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests properly
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Body parser
app.use(express.json({ limit: "50mb" }));

//  api requset limit
const limiter = rateLimit({
  windowMs:15 * 60 * 100, // 15 mnutes
  max:100, 
  standardHeaders: 'draft-7',
  legacyHeaders: false

})

// routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});
// unknown route
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error);
});
  // middleware calls
app.use(limiter)

app.use(ErrorMiddleware);
