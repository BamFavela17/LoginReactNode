import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // Importamos tus rutas separadas
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

// --- CONFIGURACIÓN DE SEGURIDAD Y MIDDLEWARES ---
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());       // Para leer el body en JSON
app.use(cookieParser());       // Para leer las cookies del navegador

// --- RUTAS ---
app.use("/api/auth", authRoutes); // Aquí vive tu authController
app.use("/api/users", userRoutes); // Aquí vive tu userController (CRUD)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});