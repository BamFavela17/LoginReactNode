import pool from "../config/db.js";

// Buscar por email
export const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  return res.rows[0];
};

// Crear usuario (con todos los campos de tu BD)
export const createUser = async ({ name, lastname, username, email, password }) => {
  const query = `
    INSERT INTO admins (name, lastname, username, email, password_hash) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id_admin as id_admin, name, lastname, username, email`;
  const res = await pool.query(query, [name, lastname, username, email, password]);
  return res.rows[0];
};

// Obtener todos (CRUD Admin)
export const findAllUsers = async () => {
  const res = await pool.query("SELECT id_admin, name, lastname, username, email, rol FROM admins");
  return res.rows;
};

// Eliminar (CRUD Admin)
export const deleteUserById = async (id) => {
  await pool.query("DELETE FROM admins WHERE id_admin = $1", [id]);
};