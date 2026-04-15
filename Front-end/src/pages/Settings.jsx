import React, { useState } from "react";
import axios from "axios";
import { Settings as SettingsIcon, Save, Mail, Lock, User, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings({ user, setUser }) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.currentPassword) {
      setMessage({ text: "Debes ingresar tu contraseña actual para guardar cambios.", type: "error" });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden.", type: "error" });
      return;
    }

    if (formData.password && formData.password === formData.currentPassword) {
      setMessage({ text: "La nueva contraseña no puede ser igual a la actual.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put("/api/auth/update-profile", formData);
      setUser(res.data.user);
      setMessage({ text: res.data.message, type: "success" });
      setFormData({ ...formData, currentPassword: "", password: "", confirmPassword: "" });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error al actualizar el perfil.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[calc(100vh-5rem)] bg-[#FAF8F5] px-6 py-10 sm:px-10 lg:px-14 overflow-y-auto">
      <div className="mx-auto max-w-2xl space-y-8">
        <section className="rounded-[24px] border border-[#F2EDE8] bg-white p-8 shadow-[0_20px_60px_rgba(92,45,14,0.08)]">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#800020] p-3 rounded-2xl shadow-lg">
                <SettingsIcon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#3D1E05] uppercase tracking-tight">
                  Ajustes de Cuenta
                </h1>
                <p className="text-xs text-[#8A7060] font-bold uppercase tracking-widest mt-1">
                  Gestiona tu información personal
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#800020] hover:text-[#D4AF37] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Volver
            </Link>
          </div>

          {message.text && (
            <div
              className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-wide">
                {message.type === "success" ? "✅" : "⚠️"} {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black flex items-center gap-2">
                <User className="w-3 h-3" /> Nombre Completo
              </label>
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold text-[#8A7060] cursor-not-allowed shadow-sm">
                {user?.name}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black flex items-center gap-2">
                <Mail className="w-3 h-3" /> Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-[#3D1E05] outline-none focus:border-[#D4AF37] focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#800020] font-black flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Contraseña Actual
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Requerida para autorizar cambios"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#3D1E05] outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                  />
                </div>

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#800020] font-black">
                  Seguridad: Cambiar Contraseña (Opcional)
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Nueva Clave
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#3D1E05] outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                  />
                  {formData.password && formData.password === formData.currentPassword && (
                    <p className="mt-1 text-[10px] text-rose-500 font-bold uppercase animate-in fade-in slide-in-from-top-1">
                      No puede ser igual a la actual
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Repetir Clave
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#3D1E05] outline-none focus:border-[#D4AF37] transition-all shadow-sm"
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-[10px] text-rose-500 font-bold uppercase animate-in fade-in slide-in-from-top-1">
                      Las claves no coinciden
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#800020] to-[#a00028] px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-900/20 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? "Actualizando..." : <><Save className="w-4 h-4 text-[#D4AF37]" /> Guardar Cambios</>}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}