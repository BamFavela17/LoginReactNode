import bcrypt from "bcryptjs";
import * as userModel from "../models/userModel.js";
import { generateToken, cookieOptions } from "../config/authConfig.js";

export const register = async (req, res) => {
  // Ajustamos a los campos de tu tabla
  const { name, email, password, datos, tipo_usuario } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Campos faltantes" });
  }

  try {
    const userExists = await userModel.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Pasamos los datos adicionales al modelo
    const newUser = await userModel.createUser({
      name,
      email,
      password: hashedPassword,
      datos,
      tipo_usuario: tipo_usuario || 'Miembro Activo'
    });

    // Usamos Id_User (como está en tu tabla)
    const token = generateToken(newUser.id_user);
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

    // Nota: en tu tabla la columna es 'password' (con minúscula o mayúscula según tu SQL)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user.id_user);
    res.cookie("token", token, cookieOptions);

    res.json({
      user: {
        id: user.id_user,
        name: user.name,
        email: user.email,
        tipo: user.tipo_usuario
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