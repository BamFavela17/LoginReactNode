import pool from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Obtener todos los administradores
export const getAdmins = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM admins");
    rows.forEach((r) => delete r.password_hash); // Ocultar hash
    res.json(rows);
  } catch (err) {
    console.error("getAdmins error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener un administrador por ID
export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM admins WHERE id_admin = $1", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    const admin = rows[0];
    delete admin.password_hash; 
    res.json(admin);
  } catch (err) {
    console.error("getAdminById error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Crear un nuevo administrador
export const createAdmin = async (req, res) => {
  try {
    const { name, lastname, username, email, password, role } = req.body;

    // Hashear la contraseña
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await pool.query(
      "INSERT INTO admins (name, lastname, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, lastname, username, email, hashed, role || 'staff']
    );

    const admin = rows[0];
    delete admin.password_hash;
    res.status(201).json(admin);
  } catch (err) {
    console.error("createAdmin error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Eliminar un administrador
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      "DELETE FROM admins WHERE id_admin = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error("deleteAdmin error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Actualizar un administrador
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, username, email, password, role } = req.body;

    // Buscamos el admin actual para manejar el hash opcional
    const currentAdmin = await pool.query("SELECT password_hash FROM admins WHERE id_admin = $1", [id]);
    if (currentAdmin.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let finalHash = currentAdmin.rows[0].password_hash;
    if (password) {
      finalHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const { rows } = await pool.query(
      "UPDATE admins SET name = $1, lastname = $2, username = $3, email = $4, password_hash = $5, role = $6 WHERE id_admin = $7 RETURNING *",
      [name, lastname, username, email, finalHash, role, id]
    );

    const admin = rows[0];
    delete admin.password_hash;
    return res.json(admin);
  } catch (err) {
    console.error("updateAdmin error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};