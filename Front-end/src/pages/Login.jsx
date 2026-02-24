import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

axios.defaults.withCredentials = true;

const API_URL = "/api/auth";

export default function Login({ setUser }) {
  const [formData, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ 
        ...formData, 
        [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      const errorMessage = err.response?.data?.message || "Credenciales inválidas. Por favor, inténtalo de nuevo.";
      setError(errorMessage);
    }
  };

  return (
    <div className="ues-login-page">
      <div className="ues-card">

        {/* Encabezado */}
        <div className="ues-card__header">
          <div className="ues-card__icon">🏋️</div>
          <h1 className="ues-card__title">INICIAR SESIÓN</h1>
          <p className="ues-card__subtitle">Sistema de Gestión — UES GYM</p>
        </div>

        {/* Error */}
        {error && (
          <div className="ues-error">
            ⚠️ {error}
          </div>
        )}

        {/* Formulario — lógica idéntica a la original */}
        <form onSubmit={handleSubmit}>
          <div className="ues-field">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ejemplo@ues.mx"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="ues-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn-ues btn-ues--gold">
            ACCEDER
          </button>
        </form>

        <p className="ues-card__link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>

      </div>
    </div>
  );
}