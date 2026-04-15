import pool from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const validateMemberData = (data, isNew = true) => {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const matriculaPattern = /^\d{8,12}$/;

  if (!data.name || !data.name.trim()) {
    errors.name = "El nombre es obligatorio.";
  }

  if (!data.matricula || !data.matricula.trim()) {
    errors.matricula = "La matrícula es obligatoria.";
  } else if (!matriculaPattern.test(data.matricula.trim())) {
    errors.matricula = "La matrícula debe tener entre 8 y 12 dígitos numéricos.";
  }

  if (!data.email || !data.email.trim()) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!emailPattern.test(data.email.trim())) {
    errors.email = "El correo no tiene un formato válido.";
  }

  const carreraPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;

  if (!data.carrera || !data.carrera.trim()) {
    errors.carrera = "La carrera es obligatoria.";
  } else if (!carreraPattern.test(data.carrera.trim())) {
    errors.carrera = "La carrera solo puede contener letras y espacios (por ejemplo: Ingeniería de Software o IS).";
  }

  if (!data.semestre || !data.semestre.trim()) {
    errors.semestre = "El semestre es obligatorio.";
  }

  if (isNew) {
    if (!data.password || !data.password.trim()) {
      errors.password = "La contraseña es obligatoria para crear un miembro.";
    } else if (data.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
  } else if (data.password && data.password.trim().length > 0 && data.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (!data.tipo_usuario || !data.tipo_usuario.trim()) {
    errors.tipo_usuario = "El tipo de usuario es obligatorio.";
  }

  if (!data.status || !data.status.trim()) {
    errors.status = "El estado es obligatorio.";
  }

  return errors;
};

// Get all users
export const getMember = async (req, res) => {
  /* #swagger.tags = ['Members']
      #swagger.summary = 'Obtener todos los miembros'
      #swagger.description = 'Retorna una lista de todos los usuarios registrados sin sus contraseñas.'
      #swagger.responses[200] = {
            description: 'Lista de usuarios obtenida con éxito.',
            schema: [{ $ref: '#/definitions/MemberResponse' }]
      }
  */
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    const sanitizedUsers = rows.map(({ password_hash, ...user }) => user);
    res.json(sanitizedUsers);
  } catch (err) {
    console.error("getUsers error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single user by id_user
export const getMemberById = async (req, res) => {
  /* #swagger.tags = ['Members']
      #swagger.summary = 'Obtener miembro por ID'
      #swagger.parameters['id'] = { description: 'ID único del usuario (id_user)' }
      #swagger.responses[200] = {
            schema: { $ref: '#/definitions/MemberResponse' }
      }
      #swagger.responses[404] = { description: 'Usuario no encontrado' }
  */
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
  /* #swagger.tags = ['Members']
      #swagger.summary = 'Registrar un nuevo miembro'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos del nuevo usuario',
            required: true,
            schema: { 
              "matricula": "11111111111",
              "carrera": "Finanzas",
              "semestre": "2do",
              "name": "nuevo",
              "email": "nuevo@ues.com",
              "password": "pass123",
              "tipo_usuario": "Miembro Activo",
              "status": "",
              "datos_fisicos": "es nuevo agrega descripcion o afecciones",
            }
      }
      #swagger.responses[201] = {
            schema: { $ref: '#/definitions/MemberResponse' }
      }
  */
  try {
    const { 
      matricula, carrera, semestre, name, email, 
      password, tipo_usuario, status, datos_fisicos, historial 
    } = req.body;

    const validationErrors = validateMemberData(req.body, true);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        message: "Validación de datos fallida.",
        errors: validationErrors,
      });
    }

    const existingMatricula = await pool.query(
      "SELECT id_user FROM users WHERE matricula = $1",
      [matricula.trim()]
    );
    if (existingMatricula.rows.length > 0) {
      return res.status(400).json({
        message: "La matrícula ya está registrada.",
        errors: { matricula: "Esta matrícula ya existe." },
      });
    }

    const existingEmail = await pool.query(
      "SELECT id_user FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        message: "El correo electrónico ya está registrado.",
        errors: { email: "Este correo ya está en uso." },
      });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await pool.query(
      `INSERT INTO users (matricula, carrera, semestre, name, email, password_hash, tipo_usuario, status, datos_fisicos, historial) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [matricula.trim(), carrera.trim(), semestre.trim(), name.trim(), email.trim().toLowerCase(), hashed, tipo_usuario.trim(), status.trim(), datos_fisicos || "", historial || ""]
    );

    const { password_hash, ...user } = rows[0];
    res.status(201).json(user);
  } catch (err) {
    console.error("createUser error", err);
    res.status(400).json({ message: "Error creating user", error: err.detail || err.message });
  }
};

// Delete user
export const deleteMember = async (req, res) => {
  /* #swagger.tags = ['Members']
      #swagger.summary = 'Eliminar un miembro'
      #swagger.parameters['id'] = { description: 'ID del usuario a eliminar' }
      #swagger.responses[204] = { description: 'Usuario eliminado correctamente' }
  */
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
  /* #swagger.tags = ['Members']
      #swagger.summary = 'Actualizar datos de un miembro'
      #swagger.parameters['id'] = { description: 'ID del usuario a actualizar' }
      #swagger.parameters['body'] = {
            in: 'body',
            schema: { 
              "matricula": "",
              "carrera": "",
              "semestre": "",
              "name": "",
              "email": "",
              "password": "",
              "tipo_usuario": "",
              "status": "",
              "datos_fisicos": "",
            }
      }
      #swagger.responses[200] = {
            schema: { $ref: '#/definitions/MemberResponse' }
      }
  */
  try {
    const { id } = req.params;
    const { 
        matricula, carrera, semestre, name, email, 
        password, tipo_usuario, status, datos_fisicos, historial 
    } = req.body;

    const validationErrors = validateMemberData(req.body, false);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        message: "Validación de datos fallida.",
        errors: validationErrors,
      });
    }

    const existingMatricula = await pool.query(
      "SELECT id_user FROM users WHERE matricula = $1 AND id_user != $2",
      [matricula.trim(), id]
    );
    if (existingMatricula.rows.length > 0) {
      return res.status(400).json({
        message: "La matrícula ya está registrada en otro miembro.",
        errors: { matricula: "Esta matrícula ya existe." },
      });
    }

    const existingEmail = await pool.query(
      "SELECT id_user FROM users WHERE email = $1 AND id_user != $2",
      [email.trim().toLowerCase(), id]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        message: "El correo electrónico ya está registrado en otro miembro.",
        errors: { email: "Este correo ya está en uso." },
      });
    }

    let query = "UPDATE users SET matricula=$1, carrera=$2, semestre=$3, name=$4, email=$5, tipo_usuario=$6, status=$7, datos_fisicos=$8, historial=$9";
    let values = [matricula.trim(), carrera.trim(), semestre.trim(), name.trim(), email.trim().toLowerCase(), tipo_usuario.trim(), status.trim(), datos_fisicos || "", historial || ""];

    if (password && password.trim()) {
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      query += ", password_hash=$10 WHERE id_user=$11 RETURNING *";
      values.push(hashed, id);
    } else {
      query += " WHERE id_user=$10 RETURNING *";
      values.push(id);
    }

    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    const { password_hash, ...user } = rows[0];
    return res.json(user);
  } catch (err) {
    console.error("updateMember error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};