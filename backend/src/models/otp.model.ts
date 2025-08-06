import mongoose, { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Otp_log";
const COLLECTION_NAME = "Otp_logs";

var otpSchema = new mongoose.Schema(
  {
    otp_token: {
      type: String,
      require: true,
    },
    otp_email: { type: String, require: true },
    otp_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const otp = model(DOCUMENT_NAME, otpSchema);

//Export the model
export default otp;
