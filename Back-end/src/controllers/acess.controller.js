import pool from "../config/db.js";

// 1. REGISTRAR ENTRADA (Check-in)
export const checkIn = async (req, res) => {
  try {
    const { matricula, id_admin } = req.body;

    // 1. Buscamos al usuario por matrícula para obtener su ID interno
    const user = await pool.query(
      "SELECT id_user FROM users WHERE matricula = $1",
      [matricula]
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }

    const id_user = user.rows[0].id_user;

    // 2. Verificar si ya está dentro (sesión sin hora_out)
    const activeSession = await pool.query(
      "SELECT id_asistencia FROM in_out WHERE id_user = $1 AND hora_out IS NULL",
      [id_user]
    );

    if (activeSession.rowCount > 0) {
      return res.status(400).json({ message: "El alumno ya tiene una entrada activa" });
    }

    // 3. Registrar entrada
    const { rows } = await pool.query(
      "INSERT INTO in_out (id_user, registrado_por) VALUES ($1, $2) RETURNING *",
      [id_user, id_admin]
    );

    res.status(201).json({ message: "Entrada registrada", data: rows[0] });
  } catch (err) {
    console.error("checkIn error", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 2. REGISTRAR SALIDA (Check-out)
export const checkOut = async (req, res) => {
  try {
    const { matricula } = req.body;

    // 1. Buscamos el ID a través de la matrícula
    const user = await pool.query(
      "SELECT id_user FROM users WHERE matricula = $1",
      [matricula]
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }

    const id_user = user.rows[0].id_user;

    // 2. Actualizar la última entrada pendiente
    const { rows, rowCount } = await pool.query(
      `UPDATE in_out 
       SET hora_out = CURRENT_TIMESTAMP 
       WHERE id_asistencia = (
         SELECT id_asistencia FROM in_out 
         WHERE id_user = $1 AND hora_out IS NULL 
         ORDER BY hora_in DESC LIMIT 1
       ) RETURNING *`,
      [id_user]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "No se encontró una entrada activa para este alumno" });
    }

    // El Trigger "tr_registrar_visita_historial" se dispara aquí automáticamente
    res.json({ message: "Salida registrada con éxito", data: rows[0] });
  } catch (err) {
    console.error("checkOut error", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 3. MONITOREO (Usa la vista, que ya tiene la matrícula)
export const getLiveStatus = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM vista_monitoreo_gym");
    res.json(rows);
  } catch (err) {
    console.error("getLiveStatus error", err);
    res.status(500).json({ message: "Error al obtener monitoreo" });
  }
};

// 4. VER HISTORIAL POR MATRÍCULA
export const getUserHistory = async (req, res) => {
  try {
    const { matricula } = req.params;
    const { rows } = await pool.query(
      "SELECT name, matricula, historial FROM users WHERE matricula = $1",
      [matricula]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getUserHistory error", err);
    res.status(500).json({ message: "Error al obtener historial" });
  }
};