import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import checkoutController from "../../controllers/checkout.controller";
import { authentication } from "../../utils/auth/authUtils";

const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));

// authentication
router.use(authentication);

router.post("/order", asyncHandler(checkoutController.orderByUser));
export default router;
