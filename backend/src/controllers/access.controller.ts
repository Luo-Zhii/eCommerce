import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";
import { CREATED, SuccessResponse } from "../core/success.response";
import statusCode from "../constants/statusCodes";
import { BadRequestError } from "../core/error.response";

class AccessController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) throw new BadRequestError("email missing!!");
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
  logout = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await accessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };
  handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get new token success",
      metadata: await accessService.handlerRefreshToken({
        keyStore: req.keyStore,
        user: req.user,
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  };
}

const accessController = new AccessController();
export default accessController;
