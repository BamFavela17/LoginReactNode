import bcrypt from "bcryptjs";
import * as userModel from "../models/userModel.js";
import { generateToken, cookieOptions } from "../config/authConfig.js";

export const register = async (req, res) => {
  // Ajustamos a los campos de tu tabla
  const { name, lastname, username, email, password } = req.body;

  if (!name || !lastname || !username || !email || !password) {
    return res.status(400).json({ message: "Campos faltantes" });
  }

  try {
    const userExists = await userModel.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Pasamos los datos adicionales al modelo (no usar 'rol' indefinido)
    const newUser = await userModel.createUser({
      name,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser.id_admin);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      user: newUser,
      message: "Registro exitoso"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);

    // Comparar con la columna real en la BD: 'password_hash'
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user.id_admin);
    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        id: user.id_admin,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
      },
      message: "Login exitoso"
    });
  } catch (error) {
    res.status(500).json({ message: "Error en servidor" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
  res.json({ message: "Sesión cerrada" });
};