import mongoose, { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER-001: order successfull
// ORDER-002: order failed
// PROMOTION-001: new promotion
// SHOP-001: new Product by user

var notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      require: true,
    },
    noti_senderId: { type: Schema.Types.ObjectId, require: true, ref: "Shop" },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, require: true },
    noti_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const notification = model(DOCUMENT_NAME, notificationSchema);
//Export the model
export default notification;
