import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createMember,
  deleteMember,
  getMember,
  getMemberById,
  updateMemeber,
} from "../controllers/members.controller.js";

const router = Router();
router.use(protect); // protejo todas las rutas de este router

router.get("/users", getMember);

router.get("/user/:id", getMemberById);

router.post("/user", createMember);

router.delete("/user/:id", deleteMember);

router.put("/user/:id", updateMemeber);

export default router;
