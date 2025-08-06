import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import templateService from "../services/template.service";

class EmailController {
  newTemplate = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "addStockToEmail success!!!",
      metadata: await templateService.newTemplate(req.body),
    }).send(res);
  };
}

const emailController = new EmailController();
export default emailController;
