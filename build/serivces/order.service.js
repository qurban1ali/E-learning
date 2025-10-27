"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrderService = exports.newOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const orderModel_1 = __importDefault(require("../models/orderModel"));
// ceate new order
exports.newOrder = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (data, res, next) => {
    const order = await orderModel_1.default.create(data);
    res.status(201).json({
        success: true,
        order
    });
});
//  get all orders
const getAllOrderService = async (res) => {
    const orders = await orderModel_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        succes: true,
        orders,
    });
};
exports.getAllOrderService = getAllOrderService;
