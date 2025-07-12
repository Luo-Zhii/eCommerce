import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import notificationController from "../../controllers/notification.controller";

const router = express.Router();

// authentication
router.use(authentication);

router.get("", asyncHandler(notificationController.listNotiByUser));
export default router;
