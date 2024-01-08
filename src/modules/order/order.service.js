import { Card } from "../../../db/models/cards.model.js";
import { Product } from "../../../db/models/product.js";

export const clearCard = async (userId) => {
  await Card.findOneAndUpdate({ user: userId }, { products: [] });
};

export const updateStock = async (products, placesOrder) => {
  if (placesOrder) {
    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: {
          availableItems: -product.quantity,
          soldItems: product.quantity,
        },
      });
    }
  } else {
    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: {
          availableItems: product.quantity,
          soldItems: -product.quantity,
        },
      });
    }
  }
};
