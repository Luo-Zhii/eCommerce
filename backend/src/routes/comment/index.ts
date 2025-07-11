import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import commentController from "../../controllers/comment.controller";

const router = express.Router();

router.post("", asyncHandler(commentController.createComments));
router.get("", asyncHandler(commentController.getCommentsByParentsId));
router.delete("", asyncHandler(commentController.deleteComment));

export default router;
