import shopModel from "../models/shop.model";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import * as crypto from "crypto";
import { IShop } from "../interface/interface";
import keyTokenService from "./keyToken.service";
import { createTokenPair, verifyJWT } from "../utils/auth/authUtils";
import { getInfoData } from "../utils";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../core/error.response";
import { findByEmail } from "./shop.service";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
};

class AccessService {
  async handlerRefreshToken(refreshToken: string) {
    // Check if the refresh token is provided
    const foundToken = await keyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // If the refresh token is found in the used tokens, throw an error
    if (foundToken) {
      const payload = await verifyJWT(refreshToken, foundToken.privateKey);
      const userId = (payload as any).user;
      const email = (payload as any).email;
      await keyTokenService.removeKeyByUser((payload as any).userId);
      throw new ForbiddenError("Something wrong happend. Pls rel-login");
    }

    // If the refresh token is not found in the used tokens, proceed to find the key
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new UnauthorizedError("Shop not registered or not found");
    }

    // Verify the refresh token using the private key
    const payload = await verifyJWT(refreshToken, holderToken.privateKey);
    const userId = (payload as any).userId;
    const email = (payload as any).email;

    // Find the shop by email
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new UnauthorizedError("Shop not registered or not found");
    }

    // Generate a new token pair
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // Ensure tokens is an object with refreshToken property
    await holderToken.updateOne({
      $set: {
        refreshToken: (tokens as any).refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
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
    const foundShop = await findByEmail(email);
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
      metadata: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
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
      console.log("Create token success:", tokens);
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
  }
  async logout({ keyStore }: any) {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log("Delete key token:", delKey);
    return delKey;
  }
}

const accessService = new AccessService();
export default accessService;
