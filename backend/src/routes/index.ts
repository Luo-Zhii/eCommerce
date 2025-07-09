import express, { Request, Response, NextFunction } from "express";

import access from "./access";
import product from "./product";
import discount from "./discount";
import cart from "./cart";
import checkout from "./checkout";
import inventory from "./inventory";

import { apiKey, checkPermission } from "../utils/auth/checkAuth";
import pushToLogDiscord from "../middlewares/index";

const router = express.Router();

// add log to discord
router.use(pushToLogDiscord);

// middlewere to check if the request is authenticated
router.use(apiKey); // check api key
router.use(checkPermission("0000")); //check permission

router.use("/v1/api/checkout", checkout);
router.use("/v1/api/discount", discount);
router.use("/v1/api/inventory", inventory);
router.use("/v1/api/cart", cart);
router.use("/v1/api/product", product);
router.use("/v1/api", access);

export default router;
