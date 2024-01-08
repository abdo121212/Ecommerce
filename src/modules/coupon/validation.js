import joi from "joi";

export const createCouponSchema = joi
  .object({
    discount: joi.number().min(1).max(100).required(),
    expiredAt: joi.date().greater(Date.now()).required(),
  })
  .required();

export const updateCouponSchema = joi
  .object({
    expiredAt: joi.date().greater(Date.now()),
    discount: joi.number().min(1).max(100),
    code: joi.string().length(5).required(),
  })
  .required();

export const deleteCouponSchema = joi
  .object({
    code: joi.string().length(5).required(),
  })
  .required();
