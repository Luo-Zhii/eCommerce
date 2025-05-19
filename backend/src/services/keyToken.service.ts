import { Types } from "mongoose";
import keytokenModel from "../models/keytoken.model";

class KeyTokenService {
  async createKeyToken(
    userId: Types.ObjectId,
    publicKey: string,
    privateKey: string,
    refreshToken: string
  ) {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const token = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return token ? token.publicKey : null;
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "An unknown error occurred";
    }
  }
}

const keyTokenService = new KeyTokenService();
export default keyTokenService;
