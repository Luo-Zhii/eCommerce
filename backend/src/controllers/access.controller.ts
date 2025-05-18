import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";

class AccessController {
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    
      return res.status(201).json(await accessService.signUp(req.body));
  };
}

const accessController = new AccessController();
export default accessController;
