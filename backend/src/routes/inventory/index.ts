import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import inventoryController from "../../controllers/inventory.controller";

const router = express.Router();

// authentication
router.use(authentication);

router.post("/add", asyncHandler(inventoryController.addStockToInventory));
export default router;
