import { asyncHandler } from "../../utils/asyncHandler.js";
import { nanoid } from "nanoid";
import cloudinary from "./../../utils/cloud.js";
import { Product } from "./../../../db/models/product.js";
import slugify from "slugify";
import { Category } from "./../../../db/models/category.model.js";
import { SubCategory } from "./../../../db/models/subCategory.js";
import { Brand } from "./../../../db/models/brand..model.js";
// CRED

// Create
export const addProduct = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));

  // check subcategory
  const subcategory = await SubCategory.findById(req.body.subCategory);
  if (!subcategory)
    return next(new Error("subcategory not found", { cause: 404 }));

  // check category
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("brand not found", { cause: 404 }));

  if (!req.files)
    return next(new Error("Product Images are required ", { cause: 400 }));

  const images = [];
  const cloudFolder = nanoid();
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `ecommerce/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `ecommerce/products/${cloudFolder}` }
  );

  const product = await Product.create({
    ...req.body,
    slug: slugify(req.body.name),
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });

  return res.status(201).json({ success: true, product });
});
//  delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  if (req.user._id.toString() != product.createdBy.toString())
    return next(new Error("Not Authorized", { cause: 401 }));

  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);

  const result = await cloudinary.api.delete_resources(ids);
  await cloudinary.api.delete_folder(
    `ecommerce/products/${product.cloudFolder}`
  );

  await Product.findByIdAndDelete(req.params.productId);

  return res.json({ success: true, message: "Deleted Sucessfully" });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const category = await Category.findById(req.params.categoryId);

    if (!category) return next(new Error(`Category not found`, { cause: 404 }));
    const product = await Product.find({ category: req.params.categoryId });
    return res.json({ success: true, product });
  }

  // data >> req.query
  // const { page } = req.query;
  // const limit = 2;
  // const skip = limit * (page - 1);
  // const { fields } = req.query;

  /************ Search ************/
  // const { keyword } = req.query;
  // const products = await Product.find({
  //   $or: [
  //     { name: { $regex: keyword, $options: "i" } },
  //     { name: { $regex: keyword, $options: "i" } },
  //   ],
  // });
  // const products = await Product.find({ name: { $regex: req.query.name } })

  /************ Filter ************/

  // const products = await Product.find({ ...req.query });

  /************ Pagination ************/

  // let { page } = req.query;
  // page = !page || page < 1 || isNaN(page) ? 1 : page;
  // const limit = 2;
  // const skip = limit * (page - 1);
  // const products = await Product.find({ ...req.query })
  //   .skip(skip)
  //   .limit(limit);

  /************ sort ************/
  // const { sort } = req.query;
  // const products = await Product.find().sort(sort);

  /************ selection ************/
  // data
  // const { fields } = req.query;
  // console.log("fields : ", fields);

  // // schema inside db
  // const modelKeys = Object.keys(Product.schema.paths);
  // console.log(modelKeys);

  // // split query req
  // const queryFields = fields.split(" ");

  // console.log(queryFields);

  // // matching
  // const filterQuery = queryFields.filter((keys) => modelKeys.includes(keys));
  // console.log("filterQuery : ", filterQuery);

  // const products = await Product.find().select(filterQuery);

  // return res.json({ success: true, result: products });

  const products = await Product.find({ ...req.query })
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort);

  return res.json({ success: true, result: products });
});

// Single Product

export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found ", { cause: 404 }));
  return res.json({ success: true, result: product });
});
