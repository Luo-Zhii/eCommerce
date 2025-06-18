import mongoose, { Schema, Types } from "mongoose";

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
var discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },

    discount_description: {
      type: String,
      default: true,
    },

    // discount_type defined percentage
    discount_type: {
      type: String,
      enum: ["fixed_amount", "percentage"],
      default: "fixed_amount",
    },

    // discount_value: 10.000d
    discount_value: {
      type: Number,
      required: true,
    },

    // discount_code: code of discount
    discount_code: {
      type: String,
      required: true,
    },

    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },

    // discount_max_uses: quantity discount is available
    discount_max_uses: {
      type: Number,
      required: true,
    },

    // discount_uses_count:  quantity discount used
    discount_uses_count: {
      type: Number,
      required: true,
    },

    // discount_users_used: who use ??
    discount_users_used: {
      type: Array,
      default: [],
    },

    // discount_max_uses_per_user: maxium amount disscount for per user
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },

    // discount_min_order_value: value order minium
    discount_min_order_value: {
      type: Number,
      required: true,
    },

    discount_shopId: {
      type: Types.ObjectId,
      ref: "Shop",
    },

    discount_is_active: {
      type: Boolean,
      default: true,
    },

    // discount_applies_to: applies to more product or not
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },

    //discount_product_ids: iput to 'specific' applies
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const discount = mongoose.model(DOCUMENT_NAME, discountSchema);
export default discount;
