import { Router } from "express";
import { isAuthenticated } from "./../../middleware/isAuthenticated.js";
import { createOrderSchema, cancalOrderSchema } from "./order.valition.js";
import { isValid } from "../../middleware/validation.js";
import { createOreder, cancelOrder } from "./order.controller.js";

const router = Router();

router.post("/", isAuthenticated, isValid(createOrderSchema), createOreder);
router.post(
  "/:orderId",
  isAuthenticated,
  isValid(cancalOrderSchema),
  cancelOrder
);

export default router;
