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
      [e.target.name]: e.target.value,
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
    <div className="min-h-screen bg-[#3D1E09] relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgba(245,166,35,0.12)_0%,transparent_60%),radial-gradient(ellipse_50%_70%_at_80%_20%,rgba(92,45,14,0.5)_0%,transparent_60%)]" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] font-black uppercase text-white/5 select-none">UES</span>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-[#F5A623]/20 rounded-[24px] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#F5A623] to-[#C17D0E] shadow-lg shadow-[#F5A623]/30 text-3xl">
            🏋️
          </div>
          <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            INICIAR SESIÓN
          </h1>
          <p className="mt-3 text-sm text-white/70">Sistema de Gestión — UES GYM</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#FFD07A]">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ejemplo@ues.mx"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F5A623] focus:bg-white/20 focus:ring-4 focus:ring-[#F5A623]/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#FFD07A]">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#F5A623] focus:bg-white/20 focus:ring-4 focus:ring-[#F5A623]/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-[16px] bg-gradient-to-r from-[#F5A623] to-[#C17D0E] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3D1E09] shadow-[0_8px_24px_rgba(245,166,35,0.3)] transition hover:-translate-y-0.5"
          >
            ACCEDER
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-white/70">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-[#FFD07A] hover:text-white">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
