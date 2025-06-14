import mongoose, { Types, model } from "mongoose";

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

var inventorySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: Types.ObjectId,
      ref: "Product",
    },

    inven_shopId: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    inven_location: {
      type: String,
      default: "unknown",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_reservation: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const inventory = mongoose.model(DOCUMENT_NAME, inventorySchema);

export default inventory;
