import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    keyStore?: any;
    user?: any;
    refreshToken?: any;
  }
}
