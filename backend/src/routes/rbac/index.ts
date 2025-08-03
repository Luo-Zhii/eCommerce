import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import rbacController from "../../controllers/rbac.controller";
const router = express.Router();

router.post("/resource", asyncHandler(rbacController.createResource));
router.get("/resources", asyncHandler(rbacController.resourceList));

router.post("/role", asyncHandler(rbacController.createRole));
router.get("/roles", asyncHandler(rbacController.roleList));

export default router;
