const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "Resources";

const resourceSchema = new Schema(
  {
    src_name: { type: String, required: true },
    src_slug: { type: String, required: true },
    src_description: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const resource = model(DOCUMENT_NAME, resourceSchema);
//Export the model
export default resource;
