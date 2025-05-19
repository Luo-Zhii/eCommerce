import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, keyTokenSchema);
