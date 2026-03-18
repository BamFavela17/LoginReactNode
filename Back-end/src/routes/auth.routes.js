import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Login
router.post("/login", async (req, res) => {
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Iniciar sesión'
     #swagger.description = 'Verifica credenciales y genera una HTTP-Only Cookie con el token JWT.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Credenciales de acceso',
        required: true,
        schema: {
            $email: 'admin@gym.com',
            $password: '12345'
        }
     }
     #swagger.responses[200] = {
        description: 'Login exitoso. La cookie "token" es enviada automáticamente.',
        schema: { 
            user: { $ref: '#/definitions/AdminResponse' } 
        }
     }
     #swagger.responses[400] = { description: 'Email o contraseña incorrectos.' }
  */
 /*  
*/
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const userQuery = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const userData = userQuery.rows[0];

    const isMatch = await bcrypt.compare(password, userData.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Cambiamos 'userData.id' por 'userData.id_admin'
    const token = generateToken(userData.id_admin);

    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        id: userData.id_admin,
        name: userData.name,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Me
router.get("/me", protect, async (req, res) => {
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Obtener perfil actual'
     #swagger.description = 'Retorna la información del administrador autenticado basándose en el token de la cookie.'
     #swagger.responses[200] = {
        description: 'Información del usuario actual.',
        schema: { $ref: '#/definitions/AdminResponse' }
     }
     #swagger.responses[401] = { description: 'No autorizado / Token inválido.' }
  */
  res.json(req.user);
});

// Logout
router.post("/logout", (req, res) => {
/* #swagger.tags = ['Auth']
     #swagger.summary = 'Cerrar sesión'
     #swagger.description = 'Invalida la cookie del navegador.'
     #swagger.responses[200] = {
        description: 'Sesión cerrada correctamente.'
     }
  */
  res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
  res.json({ message: "Logged out successfully" });
});

export default router;