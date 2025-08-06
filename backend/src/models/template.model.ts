import mongoose, { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Template";
const COLLECTION_NAME = "Templates";

var templateSchema = new mongoose.Schema(
  {
    tem_id: {
      type: Number,
      require: true,
    },
    tem_name: { type: String, require: true },
    tem_status: {
      type: String,
      default: "active",
    },
    tem_html: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const template = model(DOCUMENT_NAME, templateSchema);

//Export the model
export default template;
