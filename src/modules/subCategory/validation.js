import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";
export const createSubCategorySchema = joi
  .object({
    name: joi.string().min(5).max(20),
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const updateSubCategorySchema = joi.object({
  categoryId: joi.string().custom(isValidObjectId).required(),
  subCategoryId: joi.string().custom(isValidObjectId).required(),
  name: joi.string().min(5).max(20),
});


export const deleteSubCategorySchema = joi.object({
  categoryId: joi.string().custom(isValidObjectId).required(),
  subCategoryId: joi.string().custom(isValidObjectId).required(),
  name: joi.string().min(5).max(20),
});