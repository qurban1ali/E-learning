import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

interface CustomJwtPayload extends JwtPayload {
  id: string; // <-- make sure your token really includes this when signing
}

//    authenticated user 
export const isAutheticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as CustomJwtPayload;

    if (!decoded || !decoded.id) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Please login to access this resource", 400));
    }

    req.user = JSON.parse(user);
    next();
  }
);



  //   validate user role
  export const authorizeRoles = (...roles: string[]) => {
    return (req:Request, res:Response, next:NextFunction)=> {
      if(!roles.includes(req.user?.role || "")){
        return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403))
      }
      next()
    }
  }