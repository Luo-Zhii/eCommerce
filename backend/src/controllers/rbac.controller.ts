import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import rbacService from "../services/rbac.service";
import { IResourceList, IRoleList } from "../interface/interface";

class RbacController {
  async createRole(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Create role success!!!",
      metadata: await rbacService.createRole(req.body),
    }).send(res);
  }

  async createResource(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Create resource success!!!",
      metadata: await rbacService.createResource(req.body),
    }).send(res);
  }

  async resourceList(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Resource list success!!!",
      metadata: await rbacService.resourceList(
        req.query as unknown as IResourceList
      ),
    }).send(res);
  }

  async roleList(req: Request, res: Response, next: NextFunction) {
    new SuccessResponse({
      message: "Role list success!!!",
      metadata: await rbacService.roleList(req.query as unknown as IRoleList),
    }).send(res);
  }
}

const rbacController = new RbacController();
export default rbacController;
