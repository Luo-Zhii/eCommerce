import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import checkoutController from "../../controllers/checkout.controller";

const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));
export default router;
