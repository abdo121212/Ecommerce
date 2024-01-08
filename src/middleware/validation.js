import { Types } from "mongoose";

export const isValidObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  }
  return helper.message("Invalid ObjectId");
};

export const isValid = (schema) => {
  return (req, res, next) => {
    const reqCopy = { ...req.body, ...req.params, ...req.query };
    const resulteValidation = schema.validate(reqCopy, { abortEarly: false });
    if (resulteValidation.error) {
      const errorMessage = resulteValidation.error.details.map(
        (error) => error.message
      );
      return next(new Error(errorMessage), { cause: 400 });
    }
    return next();
  };
};

