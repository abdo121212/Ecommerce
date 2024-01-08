import joi from "joi";

// Register
export const regiserSchema = joi
  .object({
    userName: joi.string().required().min(3).max(20),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")),
    phone: joi.number(),
  })
  .required();

// Activate Account
export const activateSchema = joi
  .object({
    activationCode: joi.string().required(),
  })
  .required();
//login
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

//forget
export const forgetPassSchema = joi
  .object({
    email: joi.string().required(),
  })
  .required();

//reset password
export const resetPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    code: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
