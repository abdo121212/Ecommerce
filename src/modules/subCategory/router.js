import { Router } from "express";
import { isAuthenticated } from "./../../middleware/isAuthenticated.js";
import { isAuthroizted } from "./../../middleware/isAuthroizted.js";
import { isValid } from "../../middleware/validation.js";
import { fileUploader, fliterObject } from "../../utils/fileUploader.js";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  allSubcategories,
} from "./controller.js";
import {
  createSubCategorySchema,
  deleteSubCategorySchema,
  updateSubCategorySchema,
} from "./validation.js";

const router = Router({ mergeParams: true });
//CRAD

// Create
router.post(
  "/",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(createSubCategorySchema),
  fileUploader(fliterObject.image).single("subCategory"),
  createSubcategory
);
//   Update
router.patch(
  "/:subCategoryId",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(updateSubCategorySchema),
  fileUploader(fliterObject.image).single("subCategory"),
  updateSubcategory
);

//  delete

router.delete(
  "/:subCategoryId",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(deleteSubCategorySchema),
  deleteSubcategory
);

// Read
router.get("/", allSubcategories);
export default router;
