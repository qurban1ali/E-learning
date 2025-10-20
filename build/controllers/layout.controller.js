"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const layout_model_1 = __importDefault(require("../models/layout.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
// CREATE A LAYOUT  ---ADMIN
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isTypeExists = await layout_model_1.default.findOne({ type });
        if (isTypeExists) {
            return next(new ErrorHandler_1.default(`${type} already exists`, 400));
        }
        // WILL TEST AFTER BECOMING FRONTEND
        if (type === 'Banner') {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, { folder: 'layout' });
            const banner = {
                type: 'Banner',
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url
                    },
                    title,
                    subTitle
                }
            };
            await layout_model_1.default.create(banner);
        }
        if (type === 'Faq') {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async (item) => {
                return {
                    question: item.question,
                    answer: item.answer
                };
            }));
            await layout_model_1.default.create({ type: 'Faq', faq: faqItems });
        }
        if (type === 'Categories') {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item) => {
                return {
                    title: item.title
                };
            }));
            await layout_model_1.default.create({ type: 'Categories', categories: categoriesItems });
        }
        res.status(200).json({
            success: true,
            message: 'Layout created successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//  Edit layout
exports.editLayout = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData = await layout_model_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            // ✅ Ensure image is a string and starts with https
            let uploadedImage;
            if (typeof image === "string" && image.startsWith("https")) {
                uploadedImage = bannerData.banner.image; // use existing
            }
            else {
                const upload = await cloudinary_1.default.v2.uploader.upload(image, { folder: "layout" });
                uploadedImage = {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                };
            }
            const banner = {
                type: "Banner",
                image: uploadedImage,
                title,
                subTitle,
            };
            await layout_model_1.default.findByIdAndUpdate(bannerData._id, { banner });
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const FaqItem = await layout_model_1.default.findOne({ type: "FAQ" });
            const faqItems = faq.map((item) => ({
                question: item.question,
                answer: item.answer,
            }));
            await layout_model_1.default.findByIdAndUpdate(FaqItem?._id, { type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const CategoriesData = await layout_model_1.default.findOne({ type: "Categories" });
            const categoriesItem = categories.map((item) => ({
                title: item.title,
            }));
            await layout_model_1.default.findByIdAndUpdate(CategoriesData?._id, {
                type: "Categories",
                categories: categoriesItem,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//   get layout by type
exports.getLayoutByType = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { type } = req.params;
        const layout = await layout_model_1.default.findOne({ type });
        res.status(201).json({
            success: true,
            layout
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
