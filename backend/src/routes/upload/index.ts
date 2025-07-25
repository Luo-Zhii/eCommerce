import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import uploadController from "../../controllers/upload.controller";

const router = express.Router();

router.post("/product", asyncHandler(uploadController.uploadResult));
export default router;
