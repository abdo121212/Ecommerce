import { Router } from "express";
import { isAuthenticated } from "./../../middleware/isAuthenticated.js";
import { isAuthroizted } from "./../../middleware/isAuthroizted.js";
import { isValid } from "./../../middleware/validation.js";
import {
  creatCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "./category.validation.js";
import { fileUploader, fliterObject } from "../../utils/fileUploader.js";
import {
  creatCategory,
  updateCategory,
  deleteCategory,
  allCategroyies,
} from "./category.controller.js";
import subCategoryRouter from "../subCategory/router.js";
import ProductRouter from "../product/prodcut.router.js";

const router = Router();

router.use("/:categoryId/subCategory", subCategoryRouter);
router.use("/:categoryId/products", ProductRouter);
router.post(
  "/",
  isAuthenticated,
  isAuthroizted("admin"),
  fileUploader(fliterObject.image).single("category"),
  isValid(creatCategorySchema),
  creatCategory
);

router.patch(
  "/:categoryId",
  isAuthenticated,
  isAuthroizted("admin"),
  fileUploader(fliterObject.image).single("category"),
  isValid(updateCategorySchema),
  updateCategory
);

router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthroizted("admin"),
  fileUploader(fliterObject.image).single("category"),
  isValid(deleteCategorySchema),
  deleteCategory
);

router.get("/", allCategroyies);

export default router;
