import * as userModel from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        // Seguridad básica: Solo el personal ve la lista
        if (req.user.tipo_usuario !== 'Personal') {
            return res.status(403).json({ message: "Acceso denegado. Solo personal." });
        }
        const users = await userModel.findAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const removeUser = async (req, res) => {
    try {
        await userModel.deleteUserById(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};