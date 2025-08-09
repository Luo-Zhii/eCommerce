import { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../core/success.response";
import userService from "../services/user.service";
import { BadRequestError } from "../core/error.response";

class UserController {
  newUser = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "create new user success!!!",
      metadata: await userService.newUser({ email: req.body.email }),
    }).send(res);
  };

  checkLoginEmailToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { token = null } = req.query;

    if (typeof token !== "string") {
      throw new BadRequestError("Token must be a string");
    }
    new SuccessResponse({
      message: "create new user success!!!",
      metadata: await userService.checkLoginEmailToken({ token }),
    }).send(res);
  };
}
const userController = new UserController();
export default userController;
