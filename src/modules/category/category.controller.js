import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "./../../utils/cloud.js";
import { Category } from "./../../../db/models/category.model.js";
import slugify from "slugify";

export const creatCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new Error("Image IS Required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `Ecommerce/category` }
  );
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { url: secure_url, id: public_id },
  });
  return res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error(`Category not found`));
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image.secure_url = secure_url;
  }
  await category.save();
  return res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("category not found"));

  const resulte = await cloudinary.uploader.destroy(category.image.id);

  await Category.findByIdAndDelete(req.params.categoryId);
  return res.json({ success: true, message: "category deleted successfully" });
});

export const allCategroyies = asyncHandler(async (req, res, next) => {
  const category = await Category.find();
  return res.json({ success: true, category });
});
