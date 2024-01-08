import mongoose, { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, min: 5, required: true, max: 20 },
    slug: { type: String, min: 5, max: 20 },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    brandId: { type: Types.ObjectId, ref: "Brand" },

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Brand = mongoose.models.brandSchema || model("Brand", brandSchema);
