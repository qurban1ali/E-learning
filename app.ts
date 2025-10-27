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

// body parser
app.use(express.json({ limit: "50mb" }));

// ceate parser
app.use(cookieParser());

//cors => cross origin resource sharing
app.use(
  cors({
<<<<<<< HEAD
    origin: ['https://e-learning-client-theta.vercel.app'],
=======
    origin: ['http://localhost:3000'],
>>>>>>> 9be81cd5d37a7d64cb833791980a7d247c437183
    credentials: true
  })
);

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
