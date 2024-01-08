import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.js";

export const createBrandSchema = joi
  .object({
    name: joi.string().min(5).max(20),
  })
  .required();


  
  export const updateBrandSchema = joi
  .object({
    brandId : joi.string().custom(isValidObjectId).required()
  })
  .required();



  export const deleteBrandSchema = joi
  .object({
    brandId : joi.string().custom(isValidObjectId).required()
  })
  .required();
