import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userType = decoded.type || "admin";

    let userQuery;
    if (userType === "admin") {
      userQuery = await pool.query(
        "SELECT id_admin, name, username, email, role FROM admins WHERE id_admin = $1",
        [decoded.id]
      );
    } else {
      userQuery = await pool.query(
        "SELECT id_user, name, email, matricula, tipo_usuario, status FROM users WHERE id_user = $1",
        [decoded.id]
      );
    }

    if (userQuery.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    const user = userQuery.rows[0];
    req.user = {
      id: decoded.id,
      name: user.name,
      username: user.username || null,
      email: user.email,
      matricula: user.matricula || null,
      role: user.role || user.tipo_usuario || "alumno",
      type: userType,
      status: user.status || null,
    };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
