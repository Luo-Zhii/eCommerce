import cloudinary from "../configs/cloudinary.config";
import { s3, PutObjectCommand } from "../configs/s3.config";
import { BadRequestError } from "../core/error.response";
import { IUpload } from "../interface/interface";
import "dotenv/config";
import crypto from "crypto";

class UploadService {
  // Upload an image to Cloudinary
  async uploadResult() {
    try {
      const urlImage =
        "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg";
      const folderName = "product/shopId";
      const result = await cloudinary.uploader
        .upload(urlImage, {
          public_id: "shoes",
          folder: folderName,
        })
        .catch((error) => {
          console.log(error);
        });

      // Optimize delivery by resizing and applying auto-format and auto-quality
      await cloudinary.url("shoes", {
        fetch_format: "auto",
        quality: "auto",
      });

      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // Transform the image: auto-crop to square aspect_ratio
  async autoCropUrl() {
    await cloudinary.url("shoes", {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });
  }

  async uploadImageFromLocal({ path, folderName = "product/1111" }: IUpload) {
    try {
      if (!path) {
        throw new BadRequestError("Image path is required for upload.");
      }
      const result = await cloudinary.uploader
        .upload(path, {
          public_id: "thumb",
          folder: folderName,
        })
        .catch((error) => {
          console.log(error);
          return undefined;
        });

      // Optimize delivery by resizing and applying auto-format and auto-quality
      await cloudinary.url("shoes", {
        fetch_format: "auto",
        quality: "auto",
      });

      return {
        image_url:
          result && "secure_url" in result ? result.secure_url : undefined,
        shopId: 1111,
        thumb_url: result?.public_id
          ? await cloudinary.url(result.public_id, {
              fetch_format: "auto",
              quality: "auto",
              crop: "auto",
              gravity: "auto",
              width: 500,
              height: 500,
              format: "jpg",
            })
          : undefined,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async uploadImageFromMultiFile({
    files,
    folderName = "product/1111",
  }: IUpload) {
    try {
      const multiFileUpload = [];
      if (!files) {
        throw new BadRequestError("Image path is required for upload.");
      }

      for (const file of files) {
        const result = await cloudinary.uploader
          .upload(file.path, {
            folder: folderName,
          })
          .catch((error) => {
            console.log(error);
            return undefined;
          });
        multiFileUpload.push({
          image_url:
            result && "secure_url" in result ? result.secure_url : undefined,
          shopId: 1111,
          thumb_url: result?.public_id
            ? await cloudinary.url(result.public_id, {
                fetch_format: "auto",
                quality: "auto",
                crop: "auto",
                gravity: "auto",
                width: 500,
                height: 500,
                format: "jpg",
              })
            : undefined,
        });
      }
      return multiFileUpload;
    } catch (error) {
      console.error(error);
    }
  }

  // Upload image to AWS
  async uploadImageFromBucketS3({ file }: IUpload) {
    try {
      if (!file) {
        throw new BadRequestError("Image file is required for upload.");
      }

      const randomName = () => crypto.randomBytes(16).toString("hex");

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: randomName() || "unknown",
        Body: file.buffer,
        ContentType: "image/jpeg",
      });

      const result = s3.send(command);

      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
const uploadService = new UploadService();

export { uploadService };
