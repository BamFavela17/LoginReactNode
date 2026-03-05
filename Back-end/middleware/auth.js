import jwt from 'jsonwebtoken';
import pool from '../config/db.js'

export const protect = async (req, res, next) => {
    // Primero, verifica que la variable de entorno JWT_SECRET esté cargada.
    if (!process.env.JWT_SECRET) {
        console.error("ERROR: JWT_SECRET no está definido. Revisa la carga de dotenv.");
        return res.status(500).json({ message: 'Error de configuración del servidor: clave secreta JWT faltante.' });
    }

    let token;

    try{
        // Extrae el token de las cookies de la petición.
        token = req.cookies.token;

        if(!token){
            return res.status(401).json({ message: 'Not authorized, no token'})
        }
        
        // Verifica y decodifica el token usando la clave secreta.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Busca al usuario en la BD usando el ID del token, pero no devuelvas la contraseña.
        const user = await pool.query("SELECT id_admin, name, email, rol FROM admins WHERE id_admin = $1", [decoded.id]);

        if(user.rows.length === 0){
            return res.status(401).json({message: "Not authorized, user not found"});
        }

        // Adjunta los datos del usuario al objeto 'req' para que las rutas posteriores puedan usarlo.
        req.user = user.rows[0];
        next();

    }catch(err){
        console.error(err);
        return res.status(401).json({ message: 'Not authorized, token failed'});
    }
}