import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, Mail, Lock, Dumbbell } from "lucide-react";

axios.defaults.withCredentials = true;

const API_URL = "/api/auth";

export default function Login({ setUser }) {
  const [formData, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      const res = await axios.post(`${API_URL}/login`, formData);
      setSuccess(true);
      setTimeout(() => {
        setUser(res.data.user);
        navigate("/");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Credenciales inválidas. Por favor, inténtalo de nuevo.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3D1E09] relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgba(245,166,35,0.12)_0%,transparent_60%),radial-gradient(ellipse_50%_70%_at_80%_20%,rgba(92,45,14,0.5)_0%,transparent_60%)]" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] font-black uppercase text-white/5 select-none">UES</span>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-500">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">¡Bienvenido!</h2>
            <p className="mt-2 text-emerald-400 font-bold text-sm">Sesión iniciada con éxito</p>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#800020] shadow-lg shadow-red-900/40 text-[#D4AF37]">
                <Dumbbell className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-[0.05em] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                INICIAR SESIÓN
              </h1>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Gestión Universitaria — GymUES
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-bold uppercase tracking-wide text-rose-400 flex items-center gap-3 animate-shake">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">
                  Correo Institucional
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@ues.mx"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-[#D4AF37] focus:bg-white/10 focus:ring-4 focus:ring-[#D4AF37]/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-[#D4AF37] focus:bg-white/10 focus:ring-4 focus:ring-[#D4AF37]/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-[#800020] px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      Verificando...
                    </>
                  ) : (
                    "ACCEDER"
                  )}
                </span>
              </button>
            </form>

            <p className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-white/40">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-[#D4AF37] hover:text-white transition-colors underline underline-offset-4 decoration-[#D4AF37]/30">
                Regístrate aquí
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
