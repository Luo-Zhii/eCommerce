import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import inventoryController from "../../controllers/inventory.controller";
import emailController from "../../controllers/email.controller";
import userController from "../../controllers/user.controller";

const router = express.Router();

router.post("/new_user", asyncHandler(userController.newUser));
export default router;
