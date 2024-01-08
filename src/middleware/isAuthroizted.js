import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthroizted = (role) => {
  return asyncHandler(async (req, res, next) => {
    if (role !== req.user.role)
      return next(new Error("You are not authorized !"));
    return next();
  });
};
