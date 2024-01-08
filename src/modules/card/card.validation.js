import joi from "joi";
import { isValidObjectId } from "./../../middleware/validation.js";

export const cardSchema = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

export const removeCardSchema = joi.object({
  productId: joi.string().custom(isValidObjectId).required(),

}).required()


