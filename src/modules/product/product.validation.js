import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const createProductSchema = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    categoryId: joi.string().custom(isValidObjectId),
    subcategoryId: joi.string().custom(isValidObjectId),
    brand: joi.string().custom(isValidObjectId),
    category: joi.string().custom(isValidObjectId).required(),
    subCategory: joi.string().custom(isValidObjectId),
    brand: joi.string().custom(isValidObjectId).required(),
  })
  .required();
// read single product schema and Delete product
export const ProductIdSchema = joi
  .object({
    productId: joi.string().custom(isValidObjectId),
  })
  .required();
