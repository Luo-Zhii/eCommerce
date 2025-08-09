import shopModel from "../models/shop.model";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import * as crypto from "crypto";
import {
  IAccessToken,
  IRefreshToken,
  IShop,
  ITokenPayload,
} from "../interface/interface";
import keyTokenService from "./keyToken.service";
import { createTokenPair, verifyJWT } from "../utils/auth/authUtils";
import { getInfoData } from "../utils";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../core/error.response";
import { findByEmail } from "./shop.service";
import { Types } from "mongoose";
import keytokenModel from "../models/keytoken.model";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
};

class AccessService {
  async handlerRefreshToken({ keyStore, user, refreshToken }: IRefreshToken) {
    const { userId, email } = user as unknown as ITokenPayload;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await keyTokenService.removeKeyByUser(new Types.ObjectId(userId));
      throw new ForbiddenError("Something wrong happend. Pls rel-login");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Refresh token is not valid");
    }

    // Find the shop by email
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new UnauthorizedError("Shop not registered or not found");
    }

    // Generate a new token pair
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // Ensure tokens is an object with refreshToken property
    await keytokenModel.updateOne({
      $set: {
        refreshToken: (tokens as any).refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  }

  /*
    1 - check email in dbs 
    2 - match password 
    3 - create AT & RT and save 
    4 - gene token 
    5 - get data and return token 
  */

  async login({ email, password }: IShop) {
    // 1 - check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Email not found");
    }
    // 2 - match password
    const isMatch = await compareSync(password, foundShop.password);
    if (!isMatch) {
      throw new UnauthorizedError("Password is incorrect");
    }
    // 3 -  create AT & RT and save
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    // 4 - gene token
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );
    const refreshToken =
      typeof tokens === "string" ? tokens : tokens.refreshToken;
    if (!refreshToken) {
      throw new Error("Refresh token is missing");
    }
    await keyTokenService.createKeyToken(
      foundShop._id,
      publicKey,
      privateKey,
      refreshToken
    );

    return {
      code: 201,
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  }
  async signUp({ name, email, password }: IShop) {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Email already exists!!!!");
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

      // Output token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      // Generate a refresh token
      const refreshToken =
        typeof tokens === "string" ? tokens : tokens.refreshToken;
      if (!refreshToken) {
        throw new Error("Refresh token is missing");
      }
      const keyStore = await keyTokenService.createKeyToken(
        newShop._id,
        publicKey,
        privateKey,
        refreshToken
      );

      if (!keyStore) {
        return {
          code: "xxx",
          message: "Failed to create key token",
        };
      }

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  }
  async logout({ keyStore }: any) {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log("Delete key token:", delKey);
    return delKey;
  }
}

const accessService = new AccessService();
export default accessService;
