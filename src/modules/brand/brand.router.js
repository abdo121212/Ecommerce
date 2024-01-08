import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { fileUploader, fliterObject } from "../../utils/fileUploader.js";
import { isAuthenticated } from "./../../middleware/isAuthenticated.js";
import { isAuthroizted } from "./../../middleware/isAuthroizted.js";
import { allBrands, createBrand, deleteBrnad, updateBrand } from "./brand.controller.js";
import {
  createBrandSchema,
  deleteBrandSchema,
  updateBrandSchema,
} from "./brand.validation.js";

const router = Router();

// CRED

// create Brand

router.post(
  "/",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(createBrandSchema),
  fileUploader(fliterObject.image).single("brand"),
  createBrand
);

router.patch(
  "/:brandId",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(updateBrandSchema),
  fileUploader(fliterObject.image).single("brand"),
  updateBrand
);

router.delete(
  "/:brandId",
  isAuthenticated,
  isAuthroizted,
  isValid(deleteBrandSchema),
  fileUploader(fliterObject.image).single("brand"),
  deleteBrnad
);

router.get("/", allBrands);
export default router;
