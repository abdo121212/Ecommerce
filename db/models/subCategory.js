import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, min: 5, required: true, max: 20 },
    slug: { type: String, min: 5, max: 20 },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    brandId: [{ type: Types.ObjectId, ref: "Brand" }],

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

export const SubCategory =
  mongoose.models.subCategorySchema || model("SubCategory", subCategorySchema);
