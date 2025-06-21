import mongoose, { Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
var cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      require: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: {
      type: Array,
      require: true,
      default: [],
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const cart = mongoose.model(DOCUMENT_NAME, cartSchema);
export default cart;
