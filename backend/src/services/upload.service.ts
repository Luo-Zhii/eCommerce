import cloudinary from "../configs/cloudinary.config";

class UploadService {
  // Upload an image
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
}
const uploadService = new UploadService();

export { uploadService };
