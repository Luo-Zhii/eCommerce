import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const CLOTHING_NAME = "Clothing";
const CLOTHING_COLLECTION = "Clothings";

const ELECTRONIC_NAME = "Electronic";
const ELECTRONIC_COLLECTION = "Electronics";

const FURNITURE_NAME = "Furniture";
const FURNITURE_COLLECTION = "Furnitures";

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
    product_slug: {
      type: String, // quan-ao-cao-cap
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
      enum: ["Electronic", "Clothing", "Food", "Books", "Furniture", "Other"],
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
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Create index for search
productSchema.index({
  product_name: "text",
  product_description: "text",
});

// Documnent middleware to set product_slug before saving
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true, strict: true });
  next();
});

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

var furnitureSchema = new mongoose.Schema(
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
    collection: FURNITURE_COLLECTION,
  }
);

const product = model(DOCUMENT_NAME, productSchema);
const clothing = model(CLOTHING_NAME, clothingSchema);
const electronic = model(ELECTRONIC_NAME, electronicSchema);
const furniture = model(FURNITURE_NAME, furnitureSchema);

export { product, clothing, electronic, furniture };
