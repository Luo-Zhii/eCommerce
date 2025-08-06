import { BadRequestError } from "../core/error.response";
import { IUser } from "../interface/interface";
import user from "../models/user.model";
import emailService from "./email.service";

class UserService {
  async newUser({ email = "", captcha = "" }: IUser) {
    const foundUser = await user.findOne({ usr_email: email }).lean();

    if (foundUser) {
      throw new BadRequestError("Email already exists");
    }

    const result = await emailService.sendEmailToken({ email });

    return {
      message: "verify email user",
      metadata: {
        token: result,
      },
    };
  }
}

const userService = new UserService();
export default userService;
