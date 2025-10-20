import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// CREATE A LAYOUT  ---ADMIN
export const createLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        const isTypeExists = await LayoutModel.findOne({ type })
        if (isTypeExists) {
            return next(new ErrorHandler(`${type} already exists`, 400))
        }

        // WILL TEST AFTER BECOMING FRONTEND

        if (type === 'Banner') {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, { folder: 'layout' })

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
            }
            await LayoutModel.create(banner)
        }

        if (type === 'Faq') {
            const { faq } = req.body
            const faqItems = await Promise.all(faq.map(async (item: any) => {
                return {
                    question: item.question,
                    answer: item.answer
                }
            }))
            await LayoutModel.create({ type: 'Faq', faq: faqItems })
        }

        if (type === 'Categories') {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item: any) => {
                return {
                    title: item.title
                }
            }))
            await LayoutModel.create({ type: 'Categories', categories: categoriesItems })
        }

        res.status(200).json({
            success: true,
            message: 'Layout created successfully'
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


//  Edit layout
  export const editLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.body;

    if (type === "Banner") {
      const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
      const { image, title, subTitle } = req.body;

      // ✅ Ensure image is a string and starts with https
      let uploadedImage;

      if (typeof image === "string" && image.startsWith("https")) {
        uploadedImage = bannerData.banner.image; // use existing
      } else {
        const upload = await cloudinary.v2.uploader.upload(image, { folder: "layout" });
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

      await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const FaqItem = await LayoutModel.findOne({ type: "FAQ" });

      const faqItems = faq.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      }));

      await LayoutModel.findByIdAndUpdate(FaqItem?._id, { type: "FAQ", faq: faqItems });
    }

    if (type === "Categories") {
      const { categories } = req.body;
      const CategoriesData = await LayoutModel.findOne({ type: "Categories" });

      const categoriesItem = categories.map((item: any) => ({
        title: item.title,
      }));

      await LayoutModel.findByIdAndUpdate(CategoriesData?._id, {
        type: "Categories",
        categories: categoriesItem,
      });
    }

    res.status(200).json({
      success: true,
      message: "Layout updated successfully",
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

   


    //   get layout by type
    export const getLayoutByType = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
        try {
            const {type}= req.params;
            const layout = await LayoutModel.findOne({type});

            res.status(201).json({
                success: true,
                layout
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    })