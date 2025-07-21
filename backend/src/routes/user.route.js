import express from "express";
import { updateProfile } from "../controllers/user.controller.js";
import upload from "../services/multer.js";
const router = new express.Router()

router.post("/updateProfile",upload.single('profilePic'),updateProfile);

export default router;