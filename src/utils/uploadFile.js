import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { APIError } from "../utils/apiError.js";

const storage = multer.diskStorage({});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UploadOnCloudinary = async (file) => {
  try {
    const upload = await cloudinary.uploader.upload(file, {
      folder: "chatter",
    });
    if (!upload.url) {
      throw new APIError(400, "File uploading error, please try again.");
    }
    return upload;
  } catch (error) {
    console.log("Upload error", error);

  }
};

export { upload, UploadOnCloudinary };
