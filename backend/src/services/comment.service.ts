import { BadRequestError, NotFoundError } from "../core/error.response";
import { IComment } from "../interface/interface";
import Comment from "../models/comment.model";
import { findProduct } from "../models/repos/product.repo";
import { convertToObjectIdMongodb } from "../utils";

class CommentService {
  async createComments({
    productId,
    userId,
    content,
    parentCommentId = null,
  }: IComment) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;

    if (!productId) {
      throw new BadRequestError("productId is required");
    }

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("parent comment not found");

      rightValue = parentComment.comment_right;

      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          isDeleted: false,
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert to comment
    comment.comment_left = rightValue ?? 1;
    comment.comment_right = (rightValue ?? 1) + 1;

    await comment.save();
    return comment;
  }

  async getCommentsByParentsId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }: IComment) {
    if (!productId) {
      throw new NotFoundError("productId not found");
    }
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError("parentCommentId not found");

      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right },
        isDeleted: false,
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 });
      return comments;
    }
    const comments = await Comment.find({
      comment_parentId: null,
      comment_productId: convertToObjectIdMongodb(productId),
      isDeleted: false,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 });
    return comments;
  }

  async deleteComment({ commentId, productId }: IComment) {
    const foundProduct = await findProduct({ id: productId });
    if (!foundProduct) {
      throw new NotFoundError("Product not found");
    }
    if (!productId) {
      throw new NotFoundError("productId not found");
    }
    // Step 1: define left and right of commentId need delete
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError("comment not found");
    }
    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // Step 2: calcu width
    const width = rightValue - leftValue + 1;

    // Step 3: soft delete all sub commentId
    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    // Step 4: update left and right of other comment
    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );
  }
}

const commentService = new CommentService();
export default commentService;
