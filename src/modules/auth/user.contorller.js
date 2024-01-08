import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { User } from "../../../db/models/user.model.js";
import { Token } from "../../../db/models/token.model.js";
import { Card } from "../../../db/models/cards.model.js";
//Register
export const register = asyncHandler(async (req, res, next) => {
  //data
  const { userName, email, password, phone } = req.body;
  //check user existnce
  const isUser = await User.findOne({ email });
  if (isUser) return next(new Error("Email Must Be Unique !"));
  const isPhone = await User.findOne({ phone });
  if (isPhone) return next(new Error("Phone Must Be Unique !"));
  //hash password
  const hashPass = bcryptjs.hashSync(password, 8);

  //generate activationCode
  const activationCode = crypto.randomBytes(64).toString("hex");

  //create user
  const user = await User.create({
    userName,
    email,
    password: hashPass,
    activationCode,
    phone,
  });

  // create confirmCode
  const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`;
  //send Email
  const isSend = sendEmail({
    to: email,
    subject: `Hello ${userName}`,
    text: "Hello From Giga Acadmay ",
    html: `<h2>Chick to link to activate account</h2> ${link}`,
  });

  // send response
  return isSend
    ? res.json({ success: true, message: "Please review Your  Email" })
    : next(new Error("SomeThing Went wrong !"));
});
//login
export const logIn = asyncHandler(async (req, res, next) => {
  //data
  const { email, password } = req.body;
  //check user existed
  const user = await User.findOne({ email });

  if (!user) return next(new Error("Invalid Eamil", { cause: 400 }));
  if (!user.isConfirmed)
    return next(new Error("isConfirmed Must be True", { cause: 400 }));

  //check pass
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("Invalid Password", { cause: 400 }));
  //generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY
  );
  //seve tokne in the model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user_agent"],
  });
  //change user status to online and save user
  user.status = "online";
  await user.save();
  // send response
  return res.json({ success: true, token });
});
//Activate Account
export const activateAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { activationCode: req.params.activationCode },
    { isConfirmed: true, $unset: { activationCode: 1 } }
  );

  if (!user) return next(new Error("User Not Found !", { cause: 404 }));

  await Card.create({ user: user._id });

  return res.json({
    success: true,
    message : "success"
    // message:
    //   "Congratuation , your Account  is Now  Activated , try to login now ",
  });
});
//send Forget Code

export const sendForgetCode = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("Invalid Email"));
  //generate code
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  user.forGetCode = code;
  await user.save();
  //send email
  sendEmail({
    to: user.email,
    subject: "rest Password",
    text: `Hello${user.userName}`,
    html: `<h1>${code}</h1>`,
  });
  return res.json({ success: true, message: "check your Eamil" });
});
//reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ forGetCode: req.body.code });
  if (!user) return next(new Error("Invalid Code !"));
  user = await User.findOneAndUpdate(
    { email: req.body.email },
    { $unset: { forGetCode: 1 } }
  );
  if (!user) return next(new Error("Invalid Email"));

  user.password = bcryptjs.hashSync(
    req.body.password,
    Number(process.env.SALT_RAOUND)
  );
  await user.save();

  const tokens = await Token.find({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  return res.json({ success: true, message: " Try to login again !" });
});
