import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import checkoutController from "../../controllers/checkout.controller";
import { authentication } from "../../utils/auth/authUtils";

const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));

router.use(authentication);

router.post("/order", asyncHandler(checkoutController.orderByUser));

router.get("/orders", asyncHandler(checkoutController.getOrderByUser));

router.get(
  "/order/:orderId",
  asyncHandler(checkoutController.getOneOrderByUser)
);

router.patch(
  "/order/:orderId/cancel",
  asyncHandler(checkoutController.cancelOrder)
);

router.patch(
  "/shop/order/:orderId/status",
  asyncHandler(checkoutController.updateOrderStatusByShop)
);

export default router;
