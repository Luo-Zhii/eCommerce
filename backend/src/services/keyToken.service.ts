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
  async findUserById(userId: Types.ObjectId) {
    return await keytokenModel.findOne({ user: userId }).lean();
  }
  async findByRefreshTokenUsed(refreshToken: string) {
    return await keytokenModel
      .findOne({
        refreshTokensUsed: refreshToken,
      })
      .lean();
  }

  async findByRefreshToken(refreshToken: string) {
    return await keytokenModel.findOne({
      refreshToken: refreshToken,
    });
  }
  async removeKeyById(id: Types.ObjectId) {
    return await keytokenModel.deleteOne({ _id: id });
  }
  async removeKeyByUser(userId: Types.ObjectId) {
    return await keytokenModel.deleteOne({ user: userId });
  }
}

const keyTokenService = new KeyTokenService();
export default keyTokenService;
