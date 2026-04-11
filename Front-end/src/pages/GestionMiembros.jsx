import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Trash2, Search, RefreshCcw, UserPlus, X, Save } from "lucide-react";

const initialForm = {
  matricula: "",
  name: "",
  email: "",
  carrera: "",
  semestre: "",
  tipo_usuario: "Miembro Activo",
  status: "Activo",
  datos_fisicos: "",
  historial: "",
  password: "",
};

export default function GestionMiembros() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState(initialForm);
  const api = "/api/alumno";

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredMembers(members);
      return;
    }

    setFilteredMembers(
      members.filter((member) =>
        [member.name, member.matricula, member.carrera, member.email, member.tipo_usuario]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, members]);

  const loadMembers = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.get(`${api}/users`);
      setMembers(data);
      setFilteredMembers(data);
    } catch (error) {
      setMessage({ text: "No se pudo cargar la lista de miembros.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedId(null);
    setFormData(initialForm);
    setMessage({ text: "", type: "" });
  };

  const handleEdit = (member) => {
    setSelectedId(member.id_user);
    setFormData({
      matricula: member.matricula || "",
      name: member.name || "",
      email: member.email || "",
      carrera: member.carrera || "",
      semestre: member.semestre || "",
      tipo_usuario: member.tipo_usuario || "Miembro Activo",
      status: member.status || "Activo",
      datos_fisicos: member.datos_fisicos || "",
      historial: member.historial || "",
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar definitivamente este miembro?")) return;

    try {
      await axios.delete(`${api}/user/${id}`);
      setMessage({ text: "Miembro eliminado correctamente.", type: "success" });
      loadMembers();
    } catch (error) {
      setMessage({ text: "No se pudo eliminar el miembro.", type: "error" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    const payload = {
      matricula: formData.matricula,
      name: formData.name,
      email: formData.email,
      carrera: formData.carrera,
      semestre: formData.semestre,
      tipo_usuario: formData.tipo_usuario,
      status: formData.status,
      datos_fisicos: formData.datos_fisicos,
      historial: formData.historial,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    if (!selectedId && !payload.password) {
      setMessage({ text: "La contraseña es obligatoria para crear un miembro.", type: "error" });
      setSaving(false);
      return;
    }

    try {
      if (selectedId) {
        const body = { ...payload };
        if (!body.password) delete body.password;
        await axios.put(`${api}/user/${selectedId}`, body);
        setMessage({ text: "Miembro actualizado con éxito.", type: "success" });
      } else {
        await axios.post(`${api}/user`, payload);
        setMessage({ text: "Miembro creado correctamente.", type: "success" });
      }
      resetForm();
      loadMembers();
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error al guardar el miembro.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const activeCount = members.filter((member) => member.status?.toLowerCase() === "activo").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HEADER */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3">Gestión de Miembros</p>
              <h1 className="text-3xl sm:text-4xl font-black text-[#800020] uppercase tracking-tight">Panel de Miembros</h1>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-7 break-words">
                Administra la información de alumnos, actualiza perfiles y controla el estado de sus membresías desde una vista clara y segura.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="rounded-xl bg-slate-50 p-6 shadow-inner border border-slate-200">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Total Miembros</p>
                <p className="mt-3 text-3xl font-black text-[#800020]">{members.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-6 shadow-inner border border-slate-200">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Activos</p>
                <p className="mt-3 text-3xl font-black text-[#800020]">{activeCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID PRINCIPAL - FORMULARIO MÁS ANCHO */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] xl:grid-cols-[0.9fr_1.1fr] gap-8">
          
          {/* TABLA DE MIEMBROS */}
          <section className="space-y-6">
            <div className="flex flex-col gap-4 bg-white rounded-xl p-6 shadow-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 text-slate-500 w-full">
                  <Search className="w-5 h-5" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, matrícula, carrera o email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#800020] px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#600018] transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Nuevo Miembro
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
              <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Nombre</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Matrícula</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Carrera</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Correo</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Estado</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Cargando miembros...</td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No se encontraron miembros.</td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id_user} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#800020] uppercase break-words">{member.name}</td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-600 break-words">{member.matricula}</td>
                        <td className="px-6 py-4 text-gray-600 break-words">{member.carrera || "—"}</td>
                        <td className="px-6 py-4 text-gray-600 break-words">{member.email || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase ${member.status?.toLowerCase() === "activo" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {member.status || "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(member)}
                              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-200 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(member.id_user)}
                              className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-black uppercase tracking-widest text-rose-700 hover:bg-rose-100 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Borrar
                            </button>
                          </div>
                        </td>
                       </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* FORMULARIO - MÁS ANCHO */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-2xl sticky top-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Formulario</p>
                  <h2 className="text-2xl font-black text-[#800020]">{selectedId ? "Editar Miembro" : "Nuevo Miembro"}</h2>
                </div>
                <div className="rounded-2xl bg-[#800020] p-3 text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>

              {message.text && (
                <div className={`mb-6 rounded-2xl border p-4 text-sm font-black uppercase ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre y Matrícula en 2 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Nombre Completo</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                      placeholder="Nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Matrícula</label>
                    <input
                      name="matricula"
                      value={formData.matricula}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                      placeholder="21920000"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Correo Electrónico</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                    placeholder="alumno@ues.edu.sv"
                    required
                  />
                </div>

                {/* Carrera y Semestre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Carrera</label>
                    <input
                      name="carrera"
                      value={formData.carrera}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                      placeholder="Ingeniería"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Semestre</label>
                    <input
                      name="semestre"
                      value={formData.semestre}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                      placeholder="2do"
                    />
                  </div>
                </div>

                {/* Tipo de usuario y Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Tipo de Usuario</label>
                    <select
                      name="tipo_usuario"
                      value={formData.tipo_usuario}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                    >
                      <option value="Miembro Activo">Miembro Activo</option>
                      <option value="Personal">Personal</option>
                      <option value="Ex-miembro">Ex-miembro</option>
                      <option value="Alumno">Alumno</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Estado</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                    >
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                    Contraseña {selectedId ? "(Dejar vacío para mantener)" : ""}
                  </label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                    placeholder={selectedId ? "Nueva contraseña (opcional)" : "Contraseña segura"}
                  />
                </div>

                {/* Datos físicos */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Datos Físicos / Observaciones</label>
                  <textarea
                    name="datos_fisicos"
                    value={formData.datos_fisicos}
                    onChange={handleChange}
                    rows="3"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] focus:bg-white transition-all resize-none"
                    placeholder="Observaciones, lesiones o características físicas importantes"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#800020] to-[#a00028] px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-900/20 transition-all hover:shadow-2xl hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </span>
                  ) : selectedId ? (
                    <span className="flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      Actualizar Miembro
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Crear Miembro
                    </span>
                  )}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}