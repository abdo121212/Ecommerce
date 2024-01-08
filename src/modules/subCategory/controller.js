import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "./../../../db/models/category.model.js";
import cloudinary from "./../../utils/cloud.js";
import { SubCategory } from "./../../../db/models/subCategory.js";
import slugify from "slugify";

export const createSubcategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  if (!req.file) return next(new Error("Image Is required"));
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("category not found"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "/Ecommerce/subcategory" }
  );
  const subCategory = await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: { id: public_id, url: secure_url },
    createdBy: req.user._id,
    categoryId,
  });
  return res.json({ success: true, subCategory });
});

export const updateSubcategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  const subCategory = await SubCategory.findById(req.params.subCategoryId);
  if (!subCategory)
    return next(new Error("SubCategory not found", { cause: 404 }));

  subCategory.name = req.body.name ? req.body.name : subCategory.name;
  subCategory.slug = req.body.name ? slugify(req.body.name) : subCategory.slug;

  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: checkCategoryId.image.id,
    });
    subCategory.image.url = secure_url;
  }

  await subCategory.save();

  return res.json({
    success: true,
    message: " Update Successfully ",
    subCategory,
  });
});

export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  const subCategory = await SubCategory.findByIdAndDelete(
    req.params.subCategoryId
  );
  if (!subCategory)
    return next(new Error("SubCategory not found", { cause: 404 }));

  return res.json({
    success: true,
    message: " Deleted  Successfully ",
    subCategory,
  });
});

export const allSubcategories = asyncHandler(async (req, res, next) => {
  const allSubCategories = await SubCategory.find().populate("categoryId");
  return res.json({ success: true, resulte: allSubCategories });
});
