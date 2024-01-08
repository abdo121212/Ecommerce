import { User } from "../../db/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Token } from "./../../db/models/token.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers["token"];
  if (!token) return next(new Error("Token Is required"));
  if (!token.startsWith(process.env.BEARER_KEY))
    return next(new Error("Invalid Token"));
  token = token.split(process.env.BEARER_KEY)[1];
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("Token expired "));
  const deCdoed = jwt.verify(token, process.env.TOKEN_KEY);
  const user = await User.findOne({ email: deCdoed.email });
  if (!user) return next(new Error("user not found"));
  req.user = user;
  return next();
});
