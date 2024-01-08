import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";
export const createOrderSchema = joi
  .object({
    address: joi.string().min(10).required(),
    phone: joi.string().length(11).required(),
    coupon: joi.string().length(5),
    payment: joi.string().valid("visa", "cash").required(),
  })
  .required();

export const cancalOrderSchema = joi
  .object({
    orderId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
