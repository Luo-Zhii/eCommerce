import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";

class AccessController {
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      console.log("[P]::signUp::", req.body);
      return res.status(201).json(await accessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

const accessController = new AccessController();
export default accessController;
