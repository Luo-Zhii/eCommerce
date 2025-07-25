import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import notificationService from "../services/notification.service";
import { uploadService } from "../services/upload.service";

class UploadController {
  uploadResult = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "uploadResult success!!!",
      metadata: await uploadService.uploadResult(),
    }).send(res);
  };
}

const uploadController = new UploadController();
export default uploadController;
