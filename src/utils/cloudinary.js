import dotenv from 'dotenv'
dotenv.config(); 
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 👇 ADD THIS HERE
console.log("CLOUDINARY CONFIG 👉", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const absolutePath = path.resolve(localFilePath);

    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "auto"
    });

    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };
