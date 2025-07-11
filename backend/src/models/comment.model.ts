import mongoose, { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";
var commentSchema = new mongoose.Schema(
  {
    comment_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, default: "text" },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const Comment = model(DOCUMENT_NAME, commentSchema);
//Export the model
export default Comment;
