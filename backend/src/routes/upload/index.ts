import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import uploadController from "../../controllers/upload.controller";
import { uploadDisk, uploadMemory } from "../../configs/multer.config";

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

router.post(
  "/product/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageFromBucketS3)
);

export default router;
