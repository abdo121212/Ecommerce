import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "./../../../db/models/product.js";
import { Card } from "./../../../db/models/cards.model.js";

export const addToCard = asyncHandler(async (req, res, next) => {
  // >>> Data Body
  const { productId, quantity } = req.body;
  // Check if product not found

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));


  if (product.isStock(quantity))
    return next(
      new Error(
        `Sorry , Only ${product.availableItems} items left on the stock`
      )
    );
  const isProductCard = await Card.findOne({
    user: req.user._id,
    "products.productId": productId,
  });

  if (isProductCard) {
    isProductCard.products.forEach((product) => {
      if (product.productId.toString() === productId.toString()) {
        product.quantity = quantity;
      }
    });
    await isProductCard.save();
    return res.json({
      success: true,
      isProductCard,
      message: "product Added Successfully",
    });
  } else {
    const card = await Card.findOneAndUpdate(
      { user: req.user._id },
      { $push: { products: { productId, quantity } } },
      { new: true }
    );
    return res.json({
      success: true,
      card,
      message: "product Added Successfully",
    });
  }
});

export const getAllProductOfCards = asyncHandler(async (req, res, next) => {
  const card = await Card.findOneAndUpdate({ user: req.user._id }).populate(
    "products.productId",
    "name defaultImage.url price discount finalPrice"
  );
  return res.json({ success: true, card });
});

export const updateCard = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.body.productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  if (req.body.quantity > product.availableItems)
    return next(
      new Error(
        `Sorry , Only ${product.availableItems} items left on the stock`
      )
    );

  const card = await Card.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": req.body.productId,
    },
    { $set: { "products.$.quantity": req.body.quantity } },
    { new: true }
  );

  return res.json({ success: true, card });
});

export const removeProductFromCards = asyncHandler(async (req, res, next) => {
  const card = await Card.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  );
  return res.json({
    success: true,
    card,
    message: "product removed successfully",
  });
});

export const clearCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );
  console.log(req.user._id);
  return res.json({
    success: true,
    message: "card Cleard  successfully ",
    card,
  });
});
