import mongoose, { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "Spus";

var spuSchema = new mongoose.Schema(
  {
    sku_id: {
      type: String,
      require: true,
      unique: true,
    }, // string "{spu_id}12345-{shop_id}"
    sku_tier_idx: {
      type: Array,
      default: [0],
    },
    /*
        color = ['red', 'green'] = [0, 1]
        size = ['S', 'M'] = [0, 1]

        => red + S = [0, 0], 
            red + M = [0, 1]
    */

    sku_default: {
      type: Boolean,
      default: false,
    },
    sku_slug: {
      type: String,
      default: "",
    },
    sku_sort: {
      type: Number,
      default: 0,
    },
    sku_price: {
      type: String,
      require: true,
    },
    sku_stock: {
      type: Number,
      default: 0,
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Spu",
      require: true,
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
    isDeleted: {
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

const spu = model(DOCUMENT_NAME, spuSchema);

export { spu };
