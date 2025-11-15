import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: "instagram-clone",
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
});

const upload = multer({ storage });
export default upload;
