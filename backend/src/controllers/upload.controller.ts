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

  uploadFileThumb = async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;
    if (!file) {
      console.error("File missing");
      return res.status(400).json({ message: "File missing" });
    }
    new SuccessResponse({
      message: "uploadFileThumb success!!!",
      metadata: await uploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadImageFromMultiFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { files } = req;
    if (!files) {
      console.error("File missing");
      return res.status(400).json({ message: "File missing" });
    }
    new SuccessResponse({
      message: "uploadImageFromMultiFile success!!!",
      metadata: await uploadService.uploadImageFromMultiFile({
        files,
      }),
    }).send(res);
  };
}

const uploadController = new UploadController();
export default uploadController;
