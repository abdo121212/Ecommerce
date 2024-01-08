import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";
import { Coupon } from "./../../../db/models/coupon.model.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  const code = voucher_codes.generate({ length: 5 });
  const coupon = await Coupon.create({
    name: code[0],
    expiredAt: new Date(req.body.expiredAt).getTime(),
    discount: req.body.discount,
    createdBy: req.user._id,
  });
  return res.status(201).json({ success: true, coupon });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error("Invalid Code"));

  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? Date.now(req.body.expiredAt)
    : coupon.expiredAt;
  coupon.save();

  return res.json({
    success: true,
    message: "Coupon Updated Successfully!",
    coupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ name: req.params.code });
  if (!coupon) return next(new Error("Coupon not found", { cause: 404 }));
  if (req.user._id.toString() != coupon.createdBy.toString())
    return next(new Error("you are Not the Owner"));

  await Coupon.findOneAndDelete({ name: req.params.code });
  return res.json({
    success: true,
    message: "Coupon Deleted Successfully",
  });
});

export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find();
  return res.json({ success: true, coupons });
});
