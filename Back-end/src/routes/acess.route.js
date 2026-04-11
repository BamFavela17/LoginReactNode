import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { 
    checkIn, 
    checkOut, 
    getLiveStatus, 
    getUserHistory,
    getTodayHistory,
    getWeekHistory,
    getMonthHistory,
    getAllHistory,
    getAvailableMonths,
    getStatsByDateRange
} from "../controllers/acess.controller.js";

const router = Router();
router.use(protect);

// ==================== RUTAS EXISTENTES ====================
// Registrar entrada (Check-in)
// Cuerpo esperado: { "matricula": "21920000", "id_admin": 1 }
router.post("/in", checkIn);

// Registrar salida (Check-out)
// Cuerpo esperado: { "matricula": "21920000" }
router.put("/out", checkOut);

// Ver quién está en el gym ahora mismo (en tiempo real)
router.get("/monitor", getLiveStatus);

// Ver el historial de un alumno específico por matrícula
router.get("/history/:matricula", getUserHistory);

// ==================== NUEVAS RUTAS PARA MONITOREO HISTÓRICO ====================

// Obtener registros de hoy
// GET /api/control/history/today
router.get("/history/today", getTodayHistory);

// Obtener registros de la última semana
// GET /api/control/history/week
router.get("/history/week", getWeekHistory);

// Obtener registros de un mes específico
// GET /api/control/history/month/2024-01
router.get("/history/month/:yearMonth", getMonthHistory);

// Obtener todos los registros históricos
// GET /api/control/all-history
router.get("/all-history", getAllHistory);

// Obtener meses disponibles con registros
// GET /api/control/available-months
router.get("/available-months", getAvailableMonths);

// Obtener estadísticas por rango de fechas
// GET /api/control/stats/range?startDate=2024-01-01&endDate=2024-01-31
router.get("/stats/range", getStatsByDateRange);

export default router;