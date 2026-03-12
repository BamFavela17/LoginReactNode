import express from "express";
import { protect } from "../middleware/auth.js";
import { createAdmin, deleteAdmin, getAdminById, getAdmins, updateAdmin } from "../controllers/user.controller.js";

const router = express.Router();
router.use(protect);

router.get("/admins", getAdmins);
router.get("/admin/:id", getAdminById);
router.post("/admin", createAdmin);
router.delete("/admin/:id", deleteAdmin);
router.put("/admin", updateAdmin);

export default router;