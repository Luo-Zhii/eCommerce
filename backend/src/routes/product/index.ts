import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import productController from "../../controllers/product.controller";

const router = express.Router();

router.get("/search/:keySearch", asyncHandler(productController.searchProduct));
router.get("", asyncHandler(productController.findAllProduct));
router.get("/:product_id", asyncHandler(productController.findProduct));

// authentication
router.use(authentication);

// Route to create a new product

router.post("", asyncHandler(productController.createProduct));

router.patch("/:productId", asyncHandler(productController.updateProduct));

router.post(
  "/publish/:id",
  asyncHandler(productController.publishedProductForShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishedProductForShop)
);

// QUERY
router.get("/drafts/all", asyncHandler(productController.findAllDraftForShop));
router.get(
  "/published/all",
  asyncHandler(productController.findAllPublishedForShop)
);
export default router;
