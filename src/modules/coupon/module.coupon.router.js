import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated.js";
import { isAuthroizted } from "../../middleware/isAuthroizted.js";
import { isValid } from "../../middleware/validation.js";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  allCoupons,
} from "./module.coupon.controller.js";
import {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
} from "./validation.js";

const router = Router();

// CRAD
router.post(
  "/",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(createCouponSchema),
  createCoupon
);

router.patch(
  "/:code",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(updateCouponSchema),
  updateCoupon
);

router.delete(
  "/:code",
  isAuthenticated,
  isAuthroizted("admin"),
  isValid(deleteCouponSchema),
  deleteCoupon
);






router.get("/", allCoupons)
export default router;
