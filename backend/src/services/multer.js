import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "profile_pics",
        allowed_formats: ["jpg","png","jpeg"],
        transformation:[{width:500,height:500,crop:"limit"}]
    } 
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // Limit to 2MB
});


export default upload;