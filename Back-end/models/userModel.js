import pool from "../config/db.js";

// Buscar por email
export const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM Users WHERE Email = $1", [email]);
  return res.rows[0];
};

// Crear usuario (con todos los campos de tu BD)
export const createUser = async ({ name, email, password, datos, tipo_usuario }) => {
  const query = `
    INSERT INTO Users (Name, Email, Password, Datos, Tipo_usuario, Fecha_regiatro) 
    VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) 
    RETURNING Id_User as id_user, Name, Email, Tipo_usuario`;
  const res = await pool.query(query, [name, email, password, datos, tipo_usuario]);
  return res.rows[0];
};

// Obtener todos (CRUD Admin)
export const findAllUsers = async () => {
  const res = await pool.query("SELECT Id_User as id_user, Name, Email, Tipo_usuario, Fecha_regiatro FROM Users");
  return res.rows;
};

// Eliminar (CRUD Admin)
export const deleteUserById = async (id) => {
  await pool.query("DELETE FROM Users WHERE Id_User = $1", [id]);
};