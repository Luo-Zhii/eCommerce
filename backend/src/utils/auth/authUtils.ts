import jwt from "jsonwebtoken";
import asyncHandler from "../../helpers/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../../core/error.response";
import keyTokenService from "../../services/keyToken.service";
import { Types } from "mongoose";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIEND_ID: "x-client-id",
  REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (
  payload: Object,
  publicKey: string,
  privateKey: string
) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error("Verify error:", err);
      } else {
        console.log("Decoded payload:", decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error instanceof Error ? error.message : "An unknown error occurred";
  }
};

const authentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1, Check userId missing
    const userId = req.headers[HEADER.CLIEND_ID];
    if (!userId || Array.isArray(userId)) {
      throw new UnauthorizedError("Invalid request");
    }

    // 2. get AccessToken
    const objectUserId = new Types.ObjectId(userId);
    const keyStore = await keyTokenService.findUserById(objectUserId);
    if (!keyStore) {
      throw new NotFoundError("Key not found");
    }

    // 3. verify Token

    if (req.headers[HEADER.REFRESH_TOKEN]) {
      const refreshTokenHeader = req.headers[HEADER.REFRESH_TOKEN];
      if (!refreshTokenHeader) throw new UnauthorizedError("Invalid request");

      const refreshToken = Array.isArray(refreshTokenHeader)
        ? refreshTokenHeader[0]
        : refreshTokenHeader;
      try {
        const decodedUser = jwt.verify(refreshToken, keyStore.privateKey);
        if (
          typeof decodedUser === "object" &&
          decodedUser !== null &&
          "userId" in decodedUser &&
          userId !== (decodedUser as jwt.JwtPayload).userId
        ) {
          throw new UnauthorizedError("Invalid UserID");
        }
        req.keyStore = keyStore;
        req.user = decodedUser;
        req.refreshToken = refreshToken;
        return next();
      } catch (error) {
        throw error;
      }
    }

    const accessTokenHeader = req.headers[HEADER.AUTHORIZATION];
    if (!accessTokenHeader) throw new UnauthorizedError("Invalid request");
    const accessToken = Array.isArray(accessTokenHeader)
      ? accessTokenHeader[0]
      : accessTokenHeader;
    try {
      const decodedUser = jwt.verify(accessToken, keyStore.publicKey);
      if (
        typeof decodedUser === "object" &&
        decodedUser !== null &&
        "userId" in decodedUser &&
        userId !== (decodedUser as jwt.JwtPayload).userId
      ) {
        throw new UnauthorizedError("Invalid UserID");
      }
      req.keyStore = keyStore;
      req.user = decodedUser;
      req.accessToken = accessToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
);

const verifyJWT = async (token: string, keySecret: string) => {
  return await jwt.verify(token, keySecret);
};

export { createTokenPair, authentication, verifyJWT };
