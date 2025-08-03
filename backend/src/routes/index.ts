import express, { Request, Response, NextFunction } from "express";

import access from "./access";
import product from "./product";
import discount from "./discount";
import cart from "./cart";
import checkout from "./checkout";
import inventory from "./inventory";
import comment from "./comment";
import notification from "./notification";
import upload from "./upload";
import rbac from "./rbac";
import profile from "./profile";
import { apiKey, checkPermission } from "../utils/auth/checkAuth";
import pushToLogDiscord from "../middlewares/discord.middleware";

const router = express.Router();

// add log to discord
router.use(pushToLogDiscord);

// middlewere to check if the request is authenticated
router.use(apiKey); // check api key
router.use(checkPermission("0000")); //check permission

router.use("/v1/api/rbac", rbac);
router.use("/v1/api/profile", profile);
router.use("/v1/api/upload", upload);
router.use("/v1/api/notification", notification);
router.use("/v1/api/comment", comment);
router.use("/v1/api/checkout", checkout);
router.use("/v1/api/discount", discount);
router.use("/v1/api/inventory", inventory);
router.use("/v1/api/cart", cart);
router.use("/v1/api/product", product);
router.use("/v1/api", access);

export default router;
