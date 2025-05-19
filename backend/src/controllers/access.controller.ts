import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";
import { CREATED, SuccessResponse } from "../core/success.response";
import statusCode from "../constants/statusCodes";

class AccessController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      metadata: await accessService.login(req.body),
    }).send(res);
  };
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const result = await accessService.signUp(req.body);
    return new CREATED(
      "Create new shop success!!!",
      { metadata: result },
      {
        limit: 10,
      }
    ).send(res);
  };
}

const accessController = new AccessController();
export default accessController;
