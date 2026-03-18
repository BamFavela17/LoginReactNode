import pool from "../config/db.js";

// 1. REGISTRAR ENTRADA (Check-in)
export const checkIn = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Registrar entrada de alumno'
     #swagger.description = 'Busca al usuario por matrícula y crea un registro de entrada si no tiene uno activo.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para el ingreso',
        required: true,
        schema: {
            $matricula: '21920000',
            $id_admin: 1
        }
     }
     #swagger.responses[201] = {
        description: 'Entrada registrada correctamente.',
        schema: { 
            message: "Entrada registrada", 
            data: { $ref: '#/definitions/AttendanceRecord' } 
        }
     }
     #swagger.responses[400] = { description: 'El alumno ya tiene una entrada activa.' }
     #swagger.responses[404] = { description: 'Matrícula no encontrada.' }
  */
  try {
    const { matricula, id_admin } = req.body;
    const user = await pool.query("SELECT id_user FROM users WHERE matricula = $1", [matricula]);

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }

    const id_user = user.rows[0].id_user;
    const activeSession = await pool.query(
      "SELECT id_asistencia FROM in_out WHERE id_user = $1 AND hora_out IS NULL",
      [id_user]
    );

    if (activeSession.rowCount > 0) {
      return res.status(400).json({ message: "El alumno ya tiene una entrada activa" });
    }

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
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Registrar salida de alumno'
     #swagger.description = 'Cierra la sesión activa más reciente para el alumno indicado.'
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Matrícula del alumno que sale',
        required: true,
        schema: { $matricula: '21920000' }
     }
     #swagger.responses[200] = {
        description: 'Salida registrada con éxito.',
        schema: { 
            message: "Salida registrada con éxito", 
            data: { $ref: '#/definitions/AttendanceRecord' } 
        }
     }
     #swagger.responses[404] = { description: 'No hay entrada activa para este alumno.' }
  */
  try {
    const { matricula } = req.body;
    const user = await pool.query("SELECT id_user FROM users WHERE matricula = $1", [matricula]);

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }

    const id_user = user.rows[0].id_user;
    const { rows, rowCount } = await pool.query(
      `UPDATE in_out SET hora_out = CURRENT_TIMESTAMP 
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

    res.json({ message: "Salida registrada con éxito", data: rows[0] });
  } catch (err) {
    console.error("checkOut error", err);
    res.status(500).json({ message: "Error interno" });
  }
};

// 3. MONITOREO (Vista en tiempo real)
export const getLiveStatus = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Monitoreo en vivo'
     #swagger.description = 'Obtiene la lista de personas que se encuentran actualmente en el gimnasio.'
     #swagger.responses[200] = {
        description: 'Lista de monitoreo obtenida.',
        schema: [{
            nombre: 'John Doe',
            matricula: '21920000',
            hora_entrada: '2023-10-27T10:00:00Z',
            carrera: 'Ingeniería'
        }]
     }
  */
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
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Historial de visitas por alumno'
     #swagger.parameters['matricula'] = { 
        in: 'path', 
        description: 'Matrícula del alumno' 
     }
     #swagger.responses[200] = {
        description: 'Historial obtenido.',
        schema: {
            name: "John Doe",
            matricula: "21920000",
            historial: [
                { fecha: "2023-10-25", entrada: "08:00", salida: "10:00" }
            ]
        }
     }
  */
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