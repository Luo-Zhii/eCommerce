import multer from "multer";

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});

const uploadDisk = multer({
  storage,
});

export { uploadDisk, uploadMemory };
