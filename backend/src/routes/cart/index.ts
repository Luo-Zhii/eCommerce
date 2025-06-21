import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import cartController from "../../controllers/cart.controller";

const router = express.Router();

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteCart));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.getListToCart));
router.post("/action", asyncHandler(cartController.performAction));
export default router;
