import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import uploadController from "../../controllers/upload.controller";
import { uploadDisk } from "../../configs/multer.config";

const router = express.Router();

router.post("/product", asyncHandler(uploadController.uploadResult));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);
router.post(
  "/product/multiple",
  uploadDisk.array("files", 5),
  asyncHandler(uploadController.uploadImageFromMultiFile)
);

export default router;
