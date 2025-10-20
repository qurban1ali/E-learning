import { NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/orderModel";

// ceate new order
  export const newOrder = CatchAsyncErrors(async(data:any, res:Response, next:NextFunction) => {
    const order = await OrderModel.create(data);

    res.status(201).json({
            success: true,
            order
          });

  })

  //  get all orders
export const getAllOrderService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    succes: true,
    orders,
  });
};