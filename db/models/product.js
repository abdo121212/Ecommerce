import mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, min: 2, max: 20, required: true },
    description: String,
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },

    availableItems: { type: Number, min: 1, default: 1, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 1 },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, unique: true },
  },
  { timestamps: true, strictQuery: true, toJSON: { virtuals: true } }
);
productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.discount ? this.price - (this.price * this.discount) / 100 : this.price
  ).toFixed(2);
});

productSchema.methods.isStock = function (requiredQuantity) {
  return this.availableItems < requiredQuantity ? true : false;
};

productSchema.query.paginate = function (page) {
  /************ Pagination ************/
  page = !page || page < 1 || isNaN(page) ? 1 : page;
  const limit = 2;
  const skip = limit * (page - 1);

  return this.skip(skip).limit(limit);
};

productSchema.query.customSelect = function (fields) {
  /************ selection ************/
  // data

  if (!fields) return this;
  // schema inside db
  const modelKeys = Object.keys(Product.schema.paths);

  // split query req
  const queryFields = fields.split(" ");

  // matching
  const filterQuery = queryFields.filter((keys) => modelKeys.includes(keys));

  return this.select(fields);
};
export const Product =
  mongoose.models.Product || model("Product", productSchema);
