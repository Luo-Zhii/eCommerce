import { NextFunction, Request, Response } from "express";
import { IRole } from "../interface/interface";
import ac from "./role.middleware";
import { BadRequestError, UnauthorizedError } from "../core/error.response";
import rbacService from "../services/rbac.service";

const grantAccess = ({ action, resource }: IRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      ac.setGrants(
        await rbacService.roleList({
          userId: 0,
          limit: 30,
          offset: 0,
          search: "",
        })
      );
      const rol_name = req.query.role as string;

      if (!action || !resource) {
        throw new BadRequestError("Missing action or resource in grantAccess");
      }

      if (!rol_name || typeof rol_name !== "string") {
        throw new BadRequestError("Invalid or missing role in query");
      }

      const permission = (ac.can(rol_name) as any)[action](resource);
      if (!permission.granted) {
        throw new UnauthorizedError("u dont have permission access...  ");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default grantAccess;
