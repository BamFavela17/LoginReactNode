import express from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Todas estas rutas requieren que el usuario esté logueado
router.use(protect);
router.get("/", userController.getAllUsers);        // GET /api/users
router.delete("/:id", userController.removeUser);   // DELETE /api/users/123

export default router;