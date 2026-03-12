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
  res.json(req.user);
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
  res.json({ message: "Logged out successfully" });
});

export default router;