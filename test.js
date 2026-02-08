import dotenv from "dotenv";
dotenv.config();

import { uploadOnCloudinary } from "./src/utils/cloudinary.js";

console.log("ENV", process.env.CLOUDINARY_API_KEY);
