import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import notificationService from "../services/notification.service";

class NotificationController {
  listNotiByUser = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "listNotiByUser success!!!",
      metadata: await notificationService.listNotiByUser({
        ...req.query,
      }),
    }).send(res);
  };
}

const notificationController = new NotificationController();
export default notificationController;
