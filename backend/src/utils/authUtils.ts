import { KeyObject } from "crypto";
import jwt from "jsonwebtoken";

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

export { createTokenPair };
