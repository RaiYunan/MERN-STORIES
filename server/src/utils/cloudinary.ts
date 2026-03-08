import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";

console.log(
  "Cloudinary ENV →",
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  secure: true,
});

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  if (!localFilePath) return null;

  try {
    const response: UploadApiResponse = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
      }
    );

    console.log("File uploaded on Cloudinary:", response.secure_url);

    fs.unlinkSync(localFilePath); 
    return response;

  } catch (err) {
    console.error("Cloudinary upload error:", err);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw err;
  }
};

export { uploadOnCloudinary };

