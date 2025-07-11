import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import commentService from "../services/comment.service";

class CommentController {
  createComments = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "createComments success!!!",
      metadata: await commentService.createComments({
        ...req.body,
      }),
    }).send(res);
  };

  getCommentsByParentsId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "getCommentsByParentsId success!!!",
      metadata: await commentService.getCommentsByParentsId({
        ...req.query,
      }),
    }).send(res);
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "deleteComment success!!!",
      metadata: await commentService.deleteComment({
        ...req.body,
      }),
    }).send(res);
  };
}

const commentController = new CommentController();
export default commentController;
