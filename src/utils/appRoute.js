import authRouter from "../modules/auth/user.router.js";
import categoryRouter from "../modules/category/category.router.js";
import SubcategoryRouter from "../modules/subCategory/router.js";
import brandRouter from "../modules/brand/brand.router.js";
import productRouter from "../modules/product/prodcut.router.js";
import couponRouter from "../modules/coupon/module.coupon.router.js";
import cardRouter from "../modules/card/card.router.js";
import orderRouter from "../modules/order/order.router.js";
import morgan from "morgan";
import cors from "cors";
export const appRouter = (app, express) => {
  app.use(morgan("common"));
  //global middelware
  app.use(express.json());
  // const whiteList = ["http://127.0.0.1:5500"];

  // app.use((req, res, next) => {
  //   if (req.originalUrl.includes("/auth.confirmEmail")) {
  //     res.setHeader("Access-Control-Allow-Origin", "*");
  //     res.setHeader("Access-Control-Allow-Methods", "");

  //   }
  //   if (!whiteList.includes(req.header("origin"))) {
  //     return next(new Error("Blocked By Cors  !"));
  //   } else {
  //     res.setHeader("Access-Control-Allow-Origin", "*");
  //     res.setHeader("Access-Control-Allow-Methods", "*");
  //     res.setHeader("Access-Control-Allow-Headers", "*");
  //     res.setHeader("Access-Control-Allow-Private-Network", true);
  //     return next();
  //   }
  // });
  // cors
  app.use(cors());
  //router

  //auth

  app.use("/auth", authRouter);

  // category

  app.use("/category", categoryRouter);

  // subCategory

  app.use("/subCategory", SubcategoryRouter);

  // Brand
  app.use("/brand", brandRouter);

  // product

  app.use("/product", productRouter);

  //  coupon
  app.use("/coupon", couponRouter);

  // Card
  app.use("/card", cardRouter);

  // order
  app.use("/order", orderRouter);
  // global error handler

  app.use((error, req, res, next) => {
    return res.status(error.cause || 500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  });

  //not found page  router

  app.all("*", (req, res, next) => {
    return res.json({ success: false, message: "Page Not Found !!" });
  });
};
