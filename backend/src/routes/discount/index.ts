import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import discountController from "../../controllers/discount.controller";

const router = express.Router();

// get amount a discount
router.get("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(discountController.getAllDiscountedProductsByCode)
);

// authentication
router.use(authentication);

router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCodes));

export default router;
