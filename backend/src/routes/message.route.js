import express from "express";
import { getMessages, getUsersForSideBar, sendMessage } from "../controllers/message.controller.js";
import upload from "../services/multer.js";

const router = new express.Router()

router.get("/getusers",getUsersForSideBar);
router.get("/:id",getMessages);
router.post("/send/:id",upload.single('imgMsg'),sendMessage);

export default router;