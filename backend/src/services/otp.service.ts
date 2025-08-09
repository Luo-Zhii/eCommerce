import { BadRequestError } from "../core/error.response";
import { IOtp } from "../interface/interface";
import otp from "../models/otp.model";
import { randomUUID } from "crypto";

class OtpService {
  async geneTokenRandom() {
    const token = randomUUID();
    return token;
  }

  async newOtp({ email }: IOtp) {
    const token = await this.geneTokenRandom();
    const newToken = await otp.create({
      otp_token: token,
      otp_email: email,
    });

    return newToken;
  }

  async checkEmailToken({ token }: IOtp) {
    const tokenOtp = await otp.findOne({ otp_token: token });

    if (!tokenOtp) throw new BadRequestError("token not found");

    otp.deleteOne({ otp_token: token }).then();

    return tokenOtp;
  }
}

const otpService = new OtpService();
export default otpService;
