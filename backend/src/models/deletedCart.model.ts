import mongoose, { Types } from "mongoose";

const DOCUMENT_NAME = "DeletedCart";
const COLLECTION_NAME = "DeletedCarts";
const deletedCartSchema = new mongoose.Schema(
  {
    cart_userId: Number,
    cart_products: Array,
    cart_count_product: Number,
    cart_state: String,
    deletedAt: { type: Date, default: Date.now },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const deletedCart = mongoose.model(DOCUMENT_NAME, deletedCartSchema);
export default deletedCart;
