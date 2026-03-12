import pool from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Get all users
export const getMember = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    // Remove the hash before sending the response
    const sanitizedUsers = rows.map(({ password_hash, ...user }) => user);
    res.json(sanitizedUsers);
  } catch (err) {
    console.error("getUsers error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single user by id_user
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM users WHERE id_user = $1", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password_hash, ...user } = rows[0];
    res.json(user);
  } catch (err) {
    console.error("getUserById error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new user
export const createMember = async (req, res) => {
  try {
    const { 
      matricula, carrera, semestre, name, email, 
      password, tipo_usuario, datos_fisicos, historial 
    } = req.body;

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await pool.query(
      `INSERT INTO users (matricula, carrera, semestre, name, email, password_hash, tipo_usuario, datos_fisicos, historial) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [matricula, carrera, semestre, name, email, hashed, tipo_usuario, datos_fisicos, historial]
    );

    const { password_hash, ...user } = rows[0];
    res.status(201).json(user);
  } catch (err) {
    console.error("createUser error", err);
    // Handle unique constraint or check constraint violations
    res.status(400).json({ message: "Error creating user", error: err.detail || err.message });
  }
};

// Delete user
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM users WHERE id_user = $1", [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error("deleteMember error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user
export const updateMemeber = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        matricula, carrera, semestre, name, email, 
        password, tipo_usuario, status, datos_fisicos, historial 
    } = req.body;

    let query = "UPDATE users SET matricula=$1, carrera=$2, semestre=$3, name=$4, email=$5, tipo_usuario=$6, status=$7, datos_fisicos=$8, historial=$9";
    let values = [matricula, carrera, semestre, name, email, tipo_usuario, status, datos_fisicos, historial];

    // Only update password if a new one is provided
    if (password) {
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      query += ", password_hash=$10 WHERE id_user=$11 RETURNING *";
      values.push(hashed, id);
    } else {
      query += " WHERE id_user=$10 RETURNING *";
      values.push(id);
    }

    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Memember not found" });
    }

    const { password_hash, ...user } = rows[0];
    return res.json(user);
  } catch (err) {
    console.error("updateMember error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};