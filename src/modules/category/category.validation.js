import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";
export const creatCategorySchema = joi
  .object({
    name: joi.string().min(3).max(15).required(),
    createdBy: joi.custom(isValidObjectId),
  })
  .required();

export const updateCategorySchema = joi
  .object({
    name: joi.string().min(3).max(15),
    categoryId: joi.custom(isValidObjectId),
  })
  .required();

export const deleteCategorySchema = joi
  .object({
    name: joi.string().min(3).max(20).required(),
    categoryId: joi.custom(isValidObjectId),
  })
  .required();
