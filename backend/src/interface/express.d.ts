import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    keyStore?: any;
    user?: any;
    accessToken?: any;
    refreshToken?: any;
  }
}
