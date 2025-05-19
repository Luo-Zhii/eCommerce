import { NextFunction, Request, Response } from "express";
import accessService from "../services/access.service";
import { CREATED } from "../core/success.response";
import statusCode from "../constants/statusCodes";

class AccessController {
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    
    const result = await accessService.signUp(req.body);
    return new CREATED(
      "Create new shop success!!!", 
      { metadata: result}, 
      { 
        limit: 10,
        page: 1,
        totalPage: 1,
        totalDocs: 1,
        hasNextPage: false,
        hasPrevPage: false,
      }
    ).send(res);

  };
}

const accessController = new AccessController();
export default accessController;
