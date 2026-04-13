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
    const user = await pool.query("SELECT id_user FROM users WHERE matricula = $1 AND status = 'activo' ", [matricula]);

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

// 4.b. VER HISTORIAL DEL USUARIO AUTENTICADO
export const getMyHistory = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Historial del alumno autenticado'
     #swagger.description = 'Retorna el historial del usuario autenticado basado en su sesión.'
  */
  try {
    if (req.user.type !== "user") {
      return res.status(403).json({ message: "Solo los alumnos pueden ver su historial personal." });
    }

    const userId = req.user.id;
    const { rows: userRows } = await pool.query(
      "SELECT name, matricula FROM users WHERE id_user = $1",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = userRows[0];
    const { rows: records } = await pool.query(
      `SELECT
         i.hora_in,
         i.hora_out,
         CASE
           WHEN i.hora_out IS NULL THEN 'En curso'
           ELSE TO_CHAR(i.hora_out - i.hora_in, 'HH24:MI:SS')
         END AS duracion,
         CASE
           WHEN i.hora_out IS NULL THEN 'En curso'
           ELSE 'Finalizado'
         END AS estatus
       FROM in_out i
       WHERE i.id_user = $1
       ORDER BY i.hora_in DESC`,
      [userId]
    );

    res.json({
      name: user.name,
      matricula: user.matricula,
      records,
    });
  } catch (err) {
    console.error("getMyHistory error", err);
    res.status(500).json({ message: "Error al obtener historial" });
  }
};

// 5. OBTENER HISTORIAL DE HOY
export const getTodayHistory = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Historial de ingresos de hoy'
     #swagger.description = 'Obtiene todos los registros de entrada del día actual'
  */
  try {
    const { rows } = await pool.query(`
      SELECT 
        u.name as nombre_alumno,
        u.matricula,
        u.carrera,
        i.hora_in as entrada,
        i.hora_out as salida,
        CASE 
          WHEN i.hora_out IS NULL THEN 'DENTRO'
          ELSE 'FINALIZADO'
        END as estatus,
        COALESCE(TO_CHAR(i.hora_out - i.hora_in, 'HH24:MI:SS'), 'En curso') as tiempo_transcurrido
      FROM in_out i
      JOIN users u ON i.id_user = u.id_user
      WHERE DATE(i.hora_in) = CURRENT_DATE
      ORDER BY i.hora_in DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getTodayHistory error", err);
    res.status(500).json({ message: "Error al obtener historial de hoy" });
  }
};

// 6. OBTENER HISTORIAL DE LA SEMANA
export const getWeekHistory = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Historial de ingresos de la última semana'
     #swagger.description = 'Obtiene todos los registros de entrada de los últimos 7 días'
  */
  try {
    const { rows } = await pool.query(`
      SELECT 
        u.name as nombre_alumno,
        u.matricula,
        u.carrera,
        i.hora_in as entrada,
        i.hora_out as salida,
        CASE 
          WHEN i.hora_out IS NULL THEN 'DENTRO'
          ELSE 'FINALIZADO'
        END as estatus,
        COALESCE(TO_CHAR(i.hora_out - i.hora_in, 'HH24:MI:SS'), 'En curso') as tiempo_transcurrido
      FROM in_out i
      JOIN users u ON i.id_user = u.id_user
      WHERE i.hora_in >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY i.hora_in DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getWeekHistory error", err);
    res.status(500).json({ message: "Error al obtener historial de la semana" });
  }
};

// 7. OBTENER HISTORIAL POR MES
export const getMonthHistory = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Historial de ingresos por mes'
     #swagger.parameters['yearMonth'] = { 
        in: 'path', 
        description: 'Año y mes en formato YYYY-MM (ej: 2024-01)' 
     }
  */
  try {
    const { yearMonth } = req.params;
    const [year, month] = yearMonth.split('-');
    
    const { rows } = await pool.query(`
      SELECT 
        u.name as nombre_alumno,
        u.matricula,
        u.carrera,
        i.hora_in as entrada,
        i.hora_out as salida,
        CASE 
          WHEN i.hora_out IS NULL THEN 'DENTRO'
          ELSE 'FINALIZADO'
        END as estatus,
        COALESCE(TO_CHAR(i.hora_out - i.hora_in, 'HH24:MI:SS'), 'En curso') as tiempo_transcurrido
      FROM in_out i
      JOIN users u ON i.id_user = u.id_user
      WHERE EXTRACT(YEAR FROM i.hora_in) = $1 
        AND EXTRACT(MONTH FROM i.hora_in) = $2
      ORDER BY i.hora_in DESC
    `, [year, month]);
    
    res.json(rows);
  } catch (err) {
    console.error("getMonthHistory error", err);
    res.status(500).json({ message: "Error al obtener historial del mes" });
  }
};

// 8. OBTENER TODOS LOS REGISTROS HISTÓRICOS
export const getAllHistory = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Todos los registros históricos'
     #swagger.description = 'Obtiene todos los registros de entrada de la base de datos'
  */
  try {
    const { rows } = await pool.query(`
      SELECT 
        u.name as nombre_alumno,
        u.matricula,
        u.carrera,
        i.hora_in as entrada,
        i.hora_out as salida,
        CASE 
          WHEN i.hora_out IS NULL THEN 'DENTRO'
          ELSE 'FINALIZADO'
        END as estatus,
        COALESCE(TO_CHAR(i.hora_out - i.hora_in, 'HH24:MI:SS'), 'En curso') as tiempo_transcurrido
      FROM in_out i
      JOIN users u ON i.id_user = u.id_user
      ORDER BY i.hora_in DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAllHistory error", err);
    res.status(500).json({ message: "Error al obtener historial completo" });
  }
};

// 9. OBTENER MESES DISPONIBLES CON REGISTROS
export const getAvailableMonths = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Meses con registros disponibles'
     #swagger.description = 'Obtiene la lista de meses que tienen registros en la base de datos'
  */
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT 
        TO_CHAR(hora_in, 'YYYY-MM') as mes,
        TO_CHAR(hora_in, 'Month YYYY') as nombre_mes
      FROM in_out
      ORDER BY mes DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAvailableMonths error", err);
    res.status(500).json({ message: "Error al obtener meses disponibles" });
  }
};

// 10. OBTENER ESTADÍSTICAS POR RANGO DE FECHAS
export const getStatsByDateRange = async (req, res) => {
  /* #swagger.tags = ['Attendance']
     #swagger.summary = 'Estadísticas por rango de fechas'
     #swagger.parameters['startDate'] = { in: 'query', description: 'Fecha inicio (YYYY-MM-DD)' }
     #swagger.parameters['endDate'] = { in: 'query', description: 'Fecha fin (YYYY-MM-DD)' }
  */
  try {
    const { startDate, endDate } = req.query;
    let query = `
      SELECT 
        DATE(i.hora_in) as fecha,
        COUNT(*) as total_entradas,
        COUNT(CASE WHEN i.hora_out IS NOT NULL THEN 1 END) as total_salidas,
        EXTRACT(HOUR FROM i.hora_in) as hora
      FROM in_out i
    `;
    
    const params = [];
    if (startDate && endDate) {
      query += ` WHERE DATE(i.hora_in) BETWEEN $1 AND $2`;
      params.push(startDate, endDate);
    }
    
    query += ` GROUP BY DATE(i.hora_in), EXTRACT(HOUR FROM i.hora_in) ORDER BY fecha DESC`;
    
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("getStatsByDateRange error", err);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};