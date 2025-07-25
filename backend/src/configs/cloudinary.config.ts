import { v2 as cloudinary } from "cloudinary";
import "dotenv";

// Configuration
cloudinary.config({
  cloud_name: "dbvymbegk",
  api_key: "973293473325774",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
