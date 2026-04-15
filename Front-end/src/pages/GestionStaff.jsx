import React, { useState, useEffect } from "react";
import { Edit3, Trash2, Search, UserPlus, X, Save } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useStaffManagement,
  STAFF_ROLES_OPTIONS,
} from "../hooks/useStaffManagement";

export default function GestionStaff({ adminUser }) {
  // Determinamos si el usuario que opera la pantalla es superadmin
  const userRole = (adminUser?.role || adminUser?.tipo_usuario || "")
    .toString()
    .toLowerCase();
  const isSuperAdmin = userRole === "superadmin";

  const {
    staff,
    filteredStaff,
    loading,
    saving,
    selectedId,
    search,
    setSearch,
    message,
    formData,
    errors,
    resetForm,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleChange,
    totalStaff,
    superadmins,
  } = useStaffManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isModalOpen]);

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditStaff = (admin) => {
    handleEdit(admin);
    setIsModalOpen(true);
  };

  const onSubmit = async (e) => {
    const success = await handleSubmit(e);
    if (success) setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex flex-col items-center">
        {/* HEADER */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3 break-words">
                Gestión de Staff
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-[#800020] uppercase tracking-tight break-words">
                Administración de Personal
              </h1>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-7 break-words">
                Administra entrenadores, staff administrativo y roles de acceso
                a la plataforma con controles claros y fáciles de usar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto min-w-0">
              <div className="rounded-xl bg-slate-50 p-6 shadow-inner border border-slate-200 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 break-words">
                  Total Staff
                </p>
                <p className="mt-3 text-3xl font-black text-[#800020] break-words">
                  {totalStaff}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-6 shadow-inner border border-slate-200 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 break-words">
                  Superadmins
                </p>
                <p className="mt-3 text-3xl font-black text-[#800020] break-words">
                  {superadmins}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BUSCADOR Y ACCIONES */}
        <section className="space-y-6 w-full max-w-[1600px]">
          {/* BUSCADOR Y ACCIONES */}
          <div className="flex flex-col gap-4 bg-white rounded-xl p-6 shadow-2xl border border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Contenedor de Búsqueda */}
              <div className="flex items-center gap-3 text-slate-500 w-full max-w-xl group">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#800020] transition-colors" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, usuario, rol o email..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={openModal}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-[#800020] px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#600018] transition-all shadow-lg shadow-red-900/20 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  Nuevo Staff
                </button>

                <Link
                  to="/"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-[16px] border border-[#D4AF37] bg-[#FFF5D0] px-5 py-3 text-sm font-bold text-[#7A3D16] transition hover:bg-[#F7E3A8] active:scale-95"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>

          {/* TABLA DE PERSONAL */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100 text-sm text-left">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                    Nombre
                  </th>
                  <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                    Usuario
                  </th>
                  <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                    Email
                  </th>
                  <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                    Rol
                  </th>
                  <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  /* ESTADO DE CARGA CON SPINNER */
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative h-12 w-12">
                          {/* Círculo de fondo */}
                          <div className="absolute h-12 w-12 rounded-full border-4 border-slate-100"></div>
                          {/* Círculo animado con colores institucionales */}
                          <div className="absolute h-12 w-12 rounded-full border-4 border-t-[#800020] border-r-[#D4AF37] animate-spin"></div>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black animate-pulse">
                          Cargando registros de staff...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  /* ESTADO VACÍO */
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500 italic"
                    >
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  /* RENDERIZADO DE FILAS */
                  filteredStaff.map((admin) => (
                    <tr
                      key={admin.id_admin}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-[#800020] uppercase break-words">
                        {admin.name} {admin.lastname}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-600 break-words">
                        {admin.username}
                      </td>
                      <td className="px-6 py-4 text-gray-600 break-words">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600 uppercase break-words">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-600 border border-slate-200">
                          {admin.role || "staff"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditStaff(admin)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Editar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({
                                isOpen: true,
                                id: admin.id_admin,
                                name: `${admin.name} ${admin.lastname}`,
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-black uppercase tracking-widest text-rose-700 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
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

        {/* MODAL DEL FORMULARIO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="rounded-2xl bg-[#800020] p-3 text-white">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                    Formulario
                  </p>
                  <h2 className="text-2xl font-black text-[#800020] uppercase">
                    {selectedId ? "Editar Staff" : "Nuevo Staff"}
                  </h2>
                </div>
              </div>

              {message.text && (
                <div
                  className={`mb-6 rounded-2xl border p-4 text-sm font-black uppercase ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Nombre
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-2xl border ${errors.name ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]`}
                      placeholder="Nombre staff"
                    />
                    {errors.name && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Apellido
                    </label>
                    <input
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                      placeholder="Apellido"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* CAMPO USUARIO CON RESTRICCIÓN */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Usuario
                    </label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      readOnly={!isSuperAdmin && !!selectedId}
                      className={`mt-2 w-full rounded-2xl border ${
                        errors.username ? "border-rose-500" : "border-gray-200"
                      } bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] transition-all ${
                        !isSuperAdmin && !!selectedId
                          ? "opacity-50 cursor-not-allowed bg-slate-100"
                          : ""
                      }`}
                      placeholder="usuario123"
                    />
                    {!isSuperAdmin && !!selectedId && (
                      <p className="mt-1 text-[9px] text-slate-400 font-medium italic ml-1">
                        Solo un Superadmin puede modificar el nombre de usuario.
                      </p>
                    )}
                    {errors.username && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Email
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className={`mt-2 w-full rounded-2xl border ${errors.email ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]`}
                      placeholder="staff@gym.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Rol
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-2xl border ${errors.role ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]`}
                    >
                      {STAFF_ROLES_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.role}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Contraseña {selectedId ? "(opcional)" : ""}
                    </label>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      className={`mt-2 w-full rounded-2xl border ${errors.password ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]`}
                      placeholder={
                        selectedId
                          ? "Dejar vacío para mantener la contraseña"
                          : "Contraseña segura"
                      }
                    />
                    {errors.password && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#800020] to-[#a00028] px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    "Procesando..."
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {selectedId ? "Guardar Cambios" : "Registrar Personal"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
            />
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-rose-100 p-4 rounded-full text-rose-600">
                  <Trash2 className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  ¿Eliminar del Staff?
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Estás a punto de eliminar a <span className="font-bold text-slate-700">{deleteConfirm.name}</span>. 
                  El usuario perderá acceso inmediato a la plataforma.
                </p>
                <div className="flex gap-3 w-full pt-4">
                  <button
                    onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={async () => {
                      await handleDelete(deleteConfirm.id);
                      setDeleteConfirm({ isOpen: false, id: null, name: "" });
                    }}
                    className="flex-1 rounded-2xl bg-rose-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-rose-700 shadow-lg shadow-rose-900/20 transition-all"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
