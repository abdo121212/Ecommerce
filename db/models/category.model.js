import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, min: 4, max: 15 },
    slug: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    brandId: { type: Types.ObjectId, ref: "Brand" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("subCategory", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "categoryId",
});
export const Category = model("Category", categorySchema);
