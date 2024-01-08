import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { Brand } from "./../../../db/models/brand..model.js";
import slugify from "slugify";

export const createBrand = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new Error("Image is required"));

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "/Ecommerce/brand" }
  );
  const barnd = await Brand.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: { id: public_id, url: secure_url },
    createdBy: req.user._id,
  });

  return res.status(201).json({ success: true, barnd });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error(`brand  not found`));

  brand.name = req.body.name ? req.body.name : Brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : Brand.slug;

  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image.secure_url = secure_url;
  }

  await brand.save();

  return res.json({ success: true, brand });
});

export const deleteBrnad = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error("Invalid Brand Id "));

  if (req.user._id.toString() !== brand.createdBy.toString())
    return next(new Error("You Not authorized "));

  const result = await cloudinary.uploader.destroy(brand.image.id);
  console.log(result);

  await Brand.findByIdAndDelete(req.params.brandId);

  return res.json({ success: true, message: "Brand Deleted" });

});

export const allBrands = asyncHandler(async (req, res, next) => {
  const brand = await Brand.find();
  return res.json({ success: true, brand });
});
