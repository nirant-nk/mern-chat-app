import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { refreshAccessToken } from "../services/token.js";

const router = new express.Router()

router.post("/signup",signup);
router.post("/",login);
router.get("/",logout);
router.get("/refresh-access",refreshAccessToken);

export default router;