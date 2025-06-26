import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },

    order_checkout: { type: Object, default: {} },
    //   totalPrice: { type: Number, default: 0 },
    //   totalApplyDiscount: { type: Number, default: 0 },
    //   feeShip: { type: Number, default: 0 },

    order_shipping: {
      type: Object,
      default: {},
    },
    //   street: { type: String, default: "" },
    //   city: { type: String, default: "" },
    //   state: { type: String, default: "" },
    //   country: { type: String, default: "" },

    order_payment: { type: Object, default: {} },

    order_products: { type: Array, required: true },

    order_trackingNumber: {
      type: String,
      default: "#0123456789",
    },

    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
const order = model(DOCUMENT_NAME, orderSchema);
export default order;
