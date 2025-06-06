import express, { Request, Response, NextFunction } from "express";
import access from "./access";
import product from "./product";

import { apiKey, checkPermission } from "../utils/auth/checkAuth";

const router = express.Router();

// middlewere to check if the request is authenticated
router.use(apiKey); // check api key
router.use(checkPermission("0000")); //check permission

router.use("/v1/api/product", product);
router.use("/v1/api", access);

export default router;
