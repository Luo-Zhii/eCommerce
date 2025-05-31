import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import productController from "../../controllers/product.controller";

const router = express.Router();

// authentication
router.use(authentication);

// Route to create a new product
router.post("", asyncHandler(productController.createProduct));

export default router;
