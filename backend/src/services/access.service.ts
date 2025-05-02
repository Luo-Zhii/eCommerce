import shopModel from "../models/shop.model";
import { genSaltSync, hashSync } from "bcrypt-ts";
import * as crypto from "crypto";
import { IShop } from "../interface/interface";
import keyTokenService from "./keyToken.service";
import { createTokenPair } from "../utils/authUtils";
import { getInfoData } from "../utils";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
};

class AccessService {
  async signUp({ name, email, password }: IShop) {
    try {
      // Check if the email already exists
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Email already exists",
        };
      }
      // Hash the password

      const salt = genSaltSync(10);

      const hashedPassword = hashSync(password, salt);
      const newShop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: RoleShop.SHOP,
      });
      if (newShop) {
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        console.log({ publicKey, privateKey });

        const keyStore = await keyTokenService.createKeyToken(
          newShop._id,
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
            userId: newShop._id,
            email,
          },
          publicKey,
          privateKey
        );
        console.log("Create token success:", tokens);

        return {
          code: 201,
          metadata: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
}

const accessService = new AccessService();
export default accessService;
