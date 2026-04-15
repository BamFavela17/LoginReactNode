import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, UserPlus, Mail, Lock, User, Briefcase } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/admin`, formData);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "El registro falló. Verifica los datos e inténtalo de nuevo.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3D1E09] relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(245,166,35,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-500 my-8">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#800020] shadow-lg shadow-red-900/40 text-[#D4AF37]">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-[0.05em] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            CREAR CUENTA
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Únete a la Comunidad Berrendo</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-bold uppercase tracking-wide text-rose-400 flex items-center gap-3 animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">Nombre</label>
              <input name="name" type="text" placeholder="Nombre" required value={formData.name} onChange={handleInputChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#D4AF37] focus:bg-white/10" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">Apellido</label>
              <input name="lastname" type="text" placeholder="Apellido" value={formData.lastname} onChange={handleInputChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#D4AF37] focus:bg-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">Usuario</label>
              <input name="username" type="text" placeholder="Usuario" required value={formData.username} onChange={handleInputChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#D4AF37] focus:bg-white/10" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">Rol</label>
              <select name="role" value={formData.role} onChange={handleInputChange}
                className="w-full rounded-2xl border border-white/10 bg-[#3D1E09] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#D4AF37]">
                <option value="staff">Staff</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">Email</label>
            <input name="email" type="email" placeholder="ejemplo@ues.mx" required value={formData.email} onChange={handleInputChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#D4AF37]" />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">Contraseña</label>
            <input name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleInputChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#D4AF37]" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-2xl bg-[#800020] px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" /> : "REGISTRAR"}
            </span>
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-white/40">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#D4AF37] hover:text-white transition-colors underline underline-offset-4 decoration-[#D4AF37]/30">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
