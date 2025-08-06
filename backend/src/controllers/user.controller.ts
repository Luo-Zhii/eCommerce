import { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../core/success.response";
import userService from "../services/user.service";

class UserController {
  newUser = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "create new user success!!!",
      metadata: await userService.newUser({ email: req.body.email }),
    }).send(res);
  };

  checkRegisterEmailToken = () => {};
}
const userController = new UserController();
export default userController;
