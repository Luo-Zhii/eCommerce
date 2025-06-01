import mongoose, { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const CLOTHING_NAME = "Clothing";
const CLOTHING_COLLECTION = "Clothings";

const ELECTRONIC_NAME = "Electronic";
const ELECTRONIC_COLLECTION = "Electronics";

var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Food", "Books", "Other"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

var clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: { type: String },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: CLOTHING_COLLECTION,
  }
);

var electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: { type: String },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: ELECTRONIC_COLLECTION,
  }
);

const product = model(DOCUMENT_NAME, productSchema);
const clothing = model(CLOTHING_NAME, clothingSchema);
const electronic = model(ELECTRONIC_NAME, electronicSchema);

export { product, clothing, electronic };
