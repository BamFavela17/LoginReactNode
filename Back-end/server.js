import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import authRoutes from './src/routes/auth.routes.js'; // Importamos tus rutas separadas
import userRoutes from './src/routes/user.routes.js';
import membersRoutes from './src/routes/members.route.js'
import control from './src/routes/acess.route.js'

dotenv.config();
const app = express();

import swagger from 'swagger-ui-express'
import swagerDocumentation from './swagger.json' with { type: 'json' };


// --- RUTA DE DOCUMENTACION ---
app.use("/api-docs", swagger.serve, swagger.setup(swagerDocumentation))

// --- CONFIGURACIÓN DE SEGURIDAD Y MIDDLEWARES ---
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000", "http://localhost:5000"];

app.use(cors({
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Origen bloqueado por CORS:", origin); // Para debug
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
app.use("/api/alumno", membersRoutes);
app.use("/api/control", control);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});