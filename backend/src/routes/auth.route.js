import express from "express";
import { checkAuth, login, logout, signup } from "../controllers/auth.controller.js";
import { refreshAccessToken } from "../services/token.js";

const router = new express.Router()

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.get("/check",checkAuth);
router.get("/refresh-access",refreshAccessToken);

export default router;