import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    keyStore?: any;
    user?: any;
    accessToken?: any;
    refreshToken?: any;

    // requestId?: string;
  }
}
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}
