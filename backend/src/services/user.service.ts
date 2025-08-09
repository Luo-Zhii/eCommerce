import mongoose from "mongoose";
import { BadRequestError } from "../core/error.response";
import { IOtp, IUser } from "../interface/interface";
import { createUser } from "../models/repos/user.repo";
import user from "../models/user.model";
import { getInfoData } from "../utils";
import { createTokenPair } from "../utils/auth/authUtils";
import emailService from "./email.service";
import keyTokenService from "./keyToken.service";
import otpService from "./otp.service";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import * as crypto from "crypto";
import { getUserRole } from "../models/repos/role.repo";

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

  async checkLoginEmailToken({ token }: IOtp) {
    const { otp_email, otp_token } = await otpService.checkEmailToken({
      token,
    });

    console.log("Token from URL:", token);
    console.log("Token in DB:", otp_token);
    if (!otp_email) throw new BadRequestError("Token not found");

    // 2. check email exists in user model
    const hasUser = await this.findUserByEmailWithLogin({ email: otp_email });

    if (hasUser) throw new BadRequestError("Email already exists!!");

    // Get role

    const userRole = await getUserRole();
    // New user
    // Hash the password

    const salt = genSaltSync(10);

    const hashedPassword = hashSync(otp_email, salt);

    const newUser = await createUser({
      id: 1,
      slug: "xyzabc",
      name: otp_email,
      email: otp_email,
      password: hashedPassword,
      role: userRole._id,
    });

    if (newUser) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await keyTokenService.createKeyToken(
        newUser._id,
        publicKey,
        privateKey
      );

      if (!keyStore) {
        return {
          code: "xxx",
          message: "Failed to create key token",
        };
      }

      // Output token pair
      const tokens = await createTokenPair(
        {
          userId: newUser._id,
          otp_email,
        },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            fields: ["usr_id", "usr_name", "usr_email"],
            object: newUser,
          }),
          tokens,
        },
      };
    }
  }

  async findUserByEmailWithLogin({ email }: IOtp) {
    const foundUser = await user.findOne({ usr_email: email }).lean();

    return foundUser;
  }
}

const userService = new UserService();
export default userService;
