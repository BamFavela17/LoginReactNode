import { Router } from "express";
import { protect } from "../middleware/auth.js"; // Suponiendo que usas el mismo middleware
import { 
    checkIn, 
    checkOut, 
    getLiveStatus, 
    getUserHistory 
} from "../controllers/acess.controller.js";

const router = Router();

// Protegemos todas las rutas de asistencia
router.use(protect);

// Registrar entrada (Check-in)
// Cuerpo esperado: { "id_user": 1, "id_admin": 2 }
router.post("/in", checkIn);

// Registrar salida (Check-out)
// Cuerpo esperado: { "id_user": 1 }
router.put("/out", checkOut);

// Ver quién está en el gym ahora mismo (Monitoreo)
router.get("/monitor", getLiveStatus);

// Ver el historial redactado de un alumno específico
router.get("/history/:id_user", getUserHistory);

export default router;