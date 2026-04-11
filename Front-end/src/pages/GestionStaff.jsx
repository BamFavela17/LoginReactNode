import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit3, Trash2, Search, RefreshCcw, UserPlus } from "lucide-react";

const initialForm = {
  name: "",
  lastname: "",
  username: "",
  email: "",
  role: "staff",
  password: "",
};

export default function GestionStaff() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState(initialForm);
  const api = "/api/users";

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredStaff(staff);
      return;
    }

    setFilteredStaff(
      staff.filter((admin) =>
        [admin.name, admin.lastname, admin.username, admin.email, admin.role]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, staff]);

  const fetchStaff = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const { data } = await axios.get(`${api}/admins`);
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setMessage({ text: "No se pudo cargar el personal de staff.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedId(null);
    setFormData(initialForm);
    setMessage({ text: "", type: "" });
  };

  const handleEdit = (admin) => {
    setSelectedId(admin.id_admin);
    setFormData({
      name: admin.name || "",
      lastname: admin.lastname || "",
      username: admin.username || "",
      email: admin.email || "",
      role: admin.role || "staff",
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este miembro del staff definitivamente?")) return;

    try {
      await axios.delete(`${api}/admin/${id}`);
      setMessage({ text: "Persona de staff eliminada correctamente.", type: "success" });
      fetchStaff();
    } catch (err) {
      setMessage({ text: "No se pudo eliminar el staff.", type: "error" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    const payload = {
      name: formData.name,
      lastname: formData.lastname,
      username: formData.username,
      email: formData.email,
      role: formData.role,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    if (!selectedId && !formData.password) {
      setMessage({ text: "La contraseña es obligatoria para crear staff.", type: "error" });
      setSaving(false);
      return;
    }

    try {
      if (selectedId) {
        await axios.put(`${api}/admin/${selectedId}`, payload);
        setMessage({ text: "Staff actualizado con éxito.", type: "success" });
      } else {
        await axios.post(`${api}/admin`, payload);
        setMessage({ text: "Staff creado correctamente.", type: "success" });
      }
      resetForm();
      fetchStaff();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error al guardar el staff.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalStaff = staff.length;
  const superadmins = staff.filter((item) => item.role === "superadmin").length;

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3 break-words">Gestión de Staff</p>
              <h1 className="text-3xl sm:text-4xl font-black text-[#800020] uppercase tracking-tight break-words">Administración de Personal</h1>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-7 break-words">
                Administra entrenadores, staff administrativo y roles de acceso a la plataforma con controles claros y fáciles de usar.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto min-w-0">
              <div className="rounded-xl bg-slate-50 p-6 shadow-inner border border-slate-200 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 break-words">Total Staff</p>
                <p className="mt-3 text-3xl font-black text-[#800020] break-words">{totalStaff}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-6 shadow-inner border border-slate-200 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 break-words">Superadmins</p>
                <p className="mt-3 text-3xl font-black text-[#800020] break-words">{superadmins}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_0.85fr] gap-8">
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-0">
              <div className="flex items-center gap-3 text-gray-500 w-full min-w-0">
                <Search className="w-5 h-5" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, usuario, email o rol"
                  className="w-full min-w-0 bg-transparent outline-none text-sm font-bold"
                />
              </div>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#800020] px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#600018] transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                Nuevo Staff
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-100 text-sm text-left">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Nombre</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Usuario</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Email</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">Rol</th>
                    <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Cargando staff...</td>
                    </tr>
                  ) : filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No se encontraron registros.</td>
                    </tr>
                  ) : (
                    filteredStaff.map((admin) => (
                      <tr key={admin.id_admin} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#800020] uppercase break-words">{admin.name} {admin.lastname}</td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-600 break-words">{admin.username}</td>
                        <td className="px-6 py-4 text-gray-600 break-words">{admin.email}</td>
                        <td className="px-6 py-4 text-gray-600 uppercase break-words">{admin.role || "staff"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-200 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(admin.id_admin)}
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

          <aside className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Formulario</p>
                  <h2 className="text-2xl font-black text-[#800020]">{selectedId ? "Editar Staff" : "Nuevo Staff"}</h2>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Nombre</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                      placeholder="Nombre"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Apellido</label>
                    <input
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                      placeholder="Apellido"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Usuario</label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                      placeholder="usuario123"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                      placeholder="staff@gym.com"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Rol</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                    >
                      <option value="staff">staff</option>
                      <option value="superadmin">superadmin</option>
                      <option value="entrenador">entrenador</option>
                      <option value="admin">admin</option>
                      <option value="recepcionista">recepcionista</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Contraseña {selectedId ? "(opcional)" : ""}</label>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                      placeholder={selectedId ? "Dejar vacío para mantener la contraseña" : "Contraseña segura"}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-[#800020] px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-900/10 transition-all hover:bg-[#600018] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Guardando..." : selectedId ? "Actualizar Staff" : "Crear Staff"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
