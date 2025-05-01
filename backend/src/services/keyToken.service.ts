import { Types } from "mongoose";
import keytokenModel from "../models/keytoken.model";

class KeyTokenService {
  async createKeyToken(
    userId: Types.ObjectId,
    publicKey: string,
    privateKey: string
  ) {
    try {
      const publicKeyString = publicKey.toString();
      const privateKeyString = privateKey.toString();
      const keyToken = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyString,
        privateKey: privateKeyString,
      });
      console.log("Key token created successfully:", keyToken);
      return keyToken ? keyToken.publicKey : null;
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "An unknown error occurred";
    }
  }
}

const keyTokenService = new KeyTokenService();
export default keyTokenService;
