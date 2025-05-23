import express from "express";
import accessController from "../../controllers/access.controller";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";

const router = express.Router();

// signup
router.post("/shop/signup", asyncHandler(accessController.signUp));

//login
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authentication);

//logout
router.post("/shop/logout", asyncHandler(accessController.logout));

export default router;
