import mongoose, { Schema, Types, model } from "mongoose";

const cradSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
  products: [
    {
      productId: { type: Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export const Card = mongoose.models.Card || model("Card", cradSchema);
