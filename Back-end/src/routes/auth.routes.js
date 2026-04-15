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

const generateToken = ({ id, type }) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const adminQuery = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    let userData;
    let userType;

    if (adminQuery.rows.length > 0) {
      userData = adminQuery.rows[0];
      userType = "admin";
    } else {
      const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userQuery.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email" });
      }
      userData = userQuery.rows[0];
      userType = "user";
    }

    const isMatch = await bcrypt.compare(password, userData.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken({
      id: userType === "admin" ? userData.id_admin : userData.id_user,
      type: userType,
    });

    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        id: userType === "admin" ? userData.id_admin : userData.id_user,
        name: userData.name,
        lastname: userData.lastname || null,
        username: userData.username || null,
        email: userData.email,
        matricula: userData.matricula || null,
        role: userType === "admin" ? userData.role : userData.tipo_usuario || "alumno",
        type: userType,
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

// Actualizar Perfil (Auto-gestión)
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { id, type } = req.user;
    const { email, password, currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: "Se requiere la contraseña actual para realizar cambios." });
    }

    const table = type === "admin" ? "admins" : "users";
    const idColumn = type === "admin" ? "id_admin" : "id_user";

    // Verificar contraseña actual contra la base de datos
    const userResult = await pool.query(`SELECT password_hash FROM ${table} WHERE ${idColumn} = $1`, [id]); // Obtener el hash actual
    const storedPasswordHash = userResult.rows[0].password_hash;
    const isMatch = await bcrypt.compare(currentPassword, storedPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "La contraseña actual es incorrecta." });
    }

    // Validar formato de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && email.trim() && !emailPattern.test(email.trim())) {
      return res.status(400).json({ message: "Formato de correo inválido." });
    }

    // Si el email no se proporciona o es el mismo, no es necesario verificar duplicidad
    if (email && email.trim().toLowerCase() !== req.user.email.toLowerCase()) {
      // Verificar si el correo ya existe en otro usuario
      const checkEmail = await pool.query(
        `SELECT email FROM ${table} WHERE email = $1 AND ${idColumn} != $2`,
        [email.trim().toLowerCase(), id]
      );
      if (checkEmail.rows.length > 0) {
        return res.status(400).json({ message: "El correo ya está en uso por otro usuario." });
      }
    }

    // Verificar si el correo ya existe en otro usuario
    const checkEmail = await pool.query(
      `SELECT email FROM ${table} WHERE email = $1 AND ${idColumn} != $2`,
      [email.trim().toLowerCase(), id]
    );
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está en uso por otro usuario." });
    }

    let query = `UPDATE ${table} SET email = $1`;
    let values = [email.trim().toLowerCase()];

    if (password && password.trim().length > 0) {
      if (password.trim().length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
      }
      // Hashear la nueva contraseña para compararla con el hash almacenado
      const newPasswordHash = await bcrypt.hash(password, 10);
      const isNewPasswordSameAsOld = await bcrypt.compare(password, storedPasswordHash);
      if (isNewPasswordSameAsOld) {
        return res.status(400).json({ message: "La nueva contraseña no puede ser idéntica a la actual." });
      }
      query += `, password_hash = $2 WHERE ${idColumn} = $3 RETURNING *`; // Usar el nuevo hash
      values.push(newPasswordHash, id);
    } else {
      query += ` WHERE ${idColumn} = $2 RETURNING *`;
      values.push(id);
    }

    const { rows } = await pool.query(query, values);
    const updatedUser = rows[0];

    res.json({
      message: "Perfil actualizado correctamente.",
      user: {
        ...req.user,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error al actualizar el perfil." });
  }
});

export default router;