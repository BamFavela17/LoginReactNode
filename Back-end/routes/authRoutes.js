import express from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Nota: No necesitas poner /api/auth aquí, ya viene del server.js
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Ruta protegida para el perfil del usuario
router.get("/me", protect, (req, res) => {
    res.json(req.user);
});

export default router;