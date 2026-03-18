import { Router } from "express";
import { protect } from "../middleware/auth.js"; // Suponiendo que usas el mismo middleware
import { 
    checkIn, 
    checkOut, 
    getLiveStatus, 
    getUserHistory 
} from "../controllers/acess.controller.js";

const router = Router();
router.use(protect);

// Registrar entrada (Check-in)
// Cuerpo esperado: { "id_user": 1, "id_admin": 2 }
router.post("/in", checkIn);

// Registrar salida (Check-out)
// Cuerpo esperado: { "id_user": 1 }
router.put("/out", checkOut);

// Ver quién está en el gym ahora mismo 
router.get("/monitor", getLiveStatus);

// Ver el historial de un alumno específico
router.get("/history/:matricula", getUserHistory);

export default router;