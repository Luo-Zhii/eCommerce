import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from "../../utils/auth/authUtils";
import profileController from "../../controllers/profile.controller";
import grantAccess from "../../middlewares/rbac.middleware";

const router = express.Router();

router.get(
  "/viewAny",
  grantAccess({ action: "readAny", resource: "profile" }),
  asyncHandler(profileController.profiles)
);
router.get(
  "/viewOwn",
  grantAccess({ action: "readOwn", resource: "profile" }),
  asyncHandler(profileController.profile)
);

export default router;
