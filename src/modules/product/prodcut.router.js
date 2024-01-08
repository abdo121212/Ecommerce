import { Router } from "express";
import { isAuthenticated } from "./../../middleware/isAuthenticated.js";
import { isAuthroizted } from "./../../middleware/isAuthroizted.js";
import { fileUploader, fliterObject } from "../../utils/fileUploader.js";
import { isValid } from "../../middleware/validation.js";
import { createProductSchema, ProductIdSchema } from "./product.validation.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  singleProduct,
} from "./product.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  isAuthenticated,
  isAuthroizted("admin"),
  fileUploader(fliterObject.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  isValid(createProductSchema),
  addProduct
);

// delete product

router.delete(
  "/:productId",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(ProductIdSchema),
  deleteProduct
);

router.get("/", getAllProducts);

// read single product
router.get("/single/:productId", isValid(ProductIdSchema), singleProduct);
export default router;
