import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { CreateOrder, getAllOrders, newPayment, sendStripePublishKey } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAutheticated, CreateOrder);
orderRouter.get(
  "/get-admin-orders",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  getAllOrders
);
 
 orderRouter.get('/payment/stripepublishablekey', sendStripePublishKey);

 orderRouter.post("/payment", isAutheticated, newPayment)
export default orderRouter;
