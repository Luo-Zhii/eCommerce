import { NextFunction, Request, Response } from "express";
import { findById } from "../../services/apiKey.service";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  BEARER: "bearer",
};

const apiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const apiKey = req.headers[HEADER.API_KEY]?.toString();
    if (!apiKey) {
      return res.status(401).json({
        message: "Forbidden error",
      });
    }

    const objKey = await findById(apiKey);
    if (!objKey) {
      return res.status(401).json({
        message: "Forbidden error",
      });
    }

    (req as any).objKey = objKey;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Forbidden error",
    });
  }
};

const checkPermission = (permission: string)=> {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as any).objKey.permissions) {
      res.status(401).json({
        message: "permissions denied",
      });
      return;
    }
    console.log((req as any).objKey.permissions);

    const validPermissions = (req as any).objKey.permissions.includes(
      permission
    );
    if (!validPermissions) {
      res.status(401).json({
        message: "permissions denied",
      });
      return;
    }

    return next();
  };
};

export { apiKey, checkPermission };
