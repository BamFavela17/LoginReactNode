import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

axios.defaults.withCredentials = true;

const API_URL = "/api/users";

export default function Register({ setUser }) {
  const [formData, setForm] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "staff",
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
      const res = await axios.post(`${API_URL}/admin`, formData);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("Error de registro:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || "El registro falló. Verifica los datos e inténtalo de nuevo.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#3D1E09] relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(245,166,35,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-[#F5A623]/20 rounded-[24px] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#F5A623] to-[#C17D0E] shadow-lg shadow-[#F5A623]/30 text-3xl">
            ✏️
          </div>
          <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            CREAR CUENTA
          </h1>
          <p className="mt-3 text-sm text-white/70">Regístrate en UES GYM</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          {[
            { id: "name", label: "Nombre", type: "text", placeholder: "Tu nombre" },
            { id: "lastname", label: "Apellido", type: "text", placeholder: "Tu apellido" },
            { id: "username", label: "Usuario", type: "text", placeholder: "Nombre de usuario único" },
            { id: "email", label: "Correo Electrónico", type: "email", placeholder: "ejemplo@ues.mx" },
            { id: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 6 caracteres" },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#800020]">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                required={id !== "lastname"}
                value={formData[id]}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[#D5C9BF] bg-[#FAF8F5] px-4 py-3 text-sm text-[#2A1505] outline-none transition focus:border-[#F5A623] focus:bg-white focus:ring-4 focus:ring-[#F5A623]/20"
              />
            </div>
          ))}

          <div>
            <label htmlFor="role" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#800020]">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-[#D5C9BF] bg-[#FAF8F5] px-4 py-3 text-sm text-[#2A1505] outline-none transition focus:border-[#F5A623] focus:bg-white focus:ring-4 focus:ring-[#F5A623]/20"
            >
              <option value="staff">Staff</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-[16px] bg-gradient-to-r from-[#F5A623] to-[#C17D0E] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3D1E09] shadow-[0_8px_24px_rgba(245,166,35,0.3)] transition hover:-translate-y-0.5"
          >
            REGISTRAR
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-white/70">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-[#FFD07A] hover:text-white">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
