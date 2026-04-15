import React, { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Search,
  RefreshCcw,
  UserPlus,
  X,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMembers } from "../hooks/useMembers";
import { useMemberForm } from "../hooks/useMemberForm";

export default function GestionMiembros({ adminUser }) {
  const api = "/api/alumno";

  // Lógica de roles y permisos
  const role = (adminUser?.role || adminUser?.tipo_usuario || "alumno")
    .toString()
    .toLowerCase();
  const isSuperAdmin = role === "superadmin";

  const {
    members,
    filteredMembers,
    loading,
    search,
    setSearch,
    message,
    setMessage,
    loadMembers,
    handleDelete,
    activeCount,
  } = useMembers(api);

  const {
    formData,
    errors,
    selectedId,
    saving,
    resetForm,
    handleChange,
    handleSubmit,
    startEdit,
    semestres,
  } = useMemberForm(api, loadMembers, setMessage);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isModalOpen]);

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (member) => {
    startEdit(member);
    setIsModalOpen(true);
  };

  const onSubmit = async (e) => {
    const success = await handleSubmit(e);
    if (success) {
      setTimeout(() => closeModal(), 1500); // Cerrar tras mostrar mensaje de éxito
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HEADER */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3">
                Gestión de Miembros
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-[#800020] uppercase tracking-tight">
                Panel de Miembros
              </h1>
              <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-7">
                Administra la información de alumnos, actualiza perfiles y
                controla el estado de sus membresías.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 shadow-inner border border-slate-200">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                    Total
                  </p>
                  <p className="text-2xl font-black text-[#800020]">
                    {members.length}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 shadow-inner border border-slate-200">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                    Activos
                  </p>
                  <p className="text-2xl font-black text-[#800020]">
                    {activeCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  placeholder="Buscar por nombre, matrícula, carrera o email..."
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
                Nuevo Miembro
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

        {/* TABLA A ANCHO COMPLETO */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                  Nombre
                </th>
                <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                  Matrícula
                </th>
                <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                  Carrera
                </th>
                <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400">
                  Estado
                </th>
                <th className="px-6 py-4 uppercase tracking-[0.3em] text-[10px] text-gray-400 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      {/* Spinner Animado */}
                      <div className="relative h-12 w-12">
                        <div className="absolute h-12 w-12 rounded-full border-4 border-slate-100"></div>
                        <div className="absolute h-12 w-12 rounded-full border-4 border-t-[#800020] border-r-[#D4AF37] animate-spin"></div>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black animate-pulse">
                        Actualizando registros
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500 font-medium italic"
                  >
                    No se encontraron miembros registrados.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id_user}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-[#800020] uppercase">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {member.matricula}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {member.carrera || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase shadow-sm ${
                          member.status?.toLowerCase() === "activo"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {member.status || "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 bg-slate-100 rounded-xl text-slate-700 hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id_user)}
                          className="p-2 bg-rose-50 rounded-xl text-rose-700 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* VENTANA MODAL DEL FORMULARIO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
              <button
                onClick={closeModal}
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
                    {selectedId ? "Editar Miembro" : "Nuevo Miembro"}
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
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Nombre Completo
                    </label>
                    <input
                      name="name"
                      placeholder="Nombre y apellido"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-2xl border ${errors.name ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] transition-all`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Matrícula
                    </label>
                    <input
                      name="matricula"
                      placeholder="ID de alumno"
                      value={formData.matricula}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-2xl border ${
                        errors.matricula ? "border-rose-500" : "border-gray-200"
                      } bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] transition-all ${
                        !isSuperAdmin && !!selectedId
                          ? "opacity-50 cursor-not-allowed bg-slate-100"
                          : ""
                      }`}
                      /* Lógica: Solo es de lectura si NO eres superadmin 
     Y además estás en modo edición (selectedId existe) 
  */
                      readOnly={!isSuperAdmin && !!selectedId}
                    />
                    {errors.matricula && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.matricula}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                    Correo Electrónico
                  </label>
                  <input
                    name="email"
                    placeholder="correo@ues.mx"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className={`mt-2 w-full rounded-2xl border ${errors.email ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] transition-all`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Carrera
                    </label>
                    <input
                      name="carrera"
                      placeholder="Nombre de la carrera"
                      value={formData.carrera}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-2xl border ${errors.carrera ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] transition-all`}
                    />
                    {errors.carrera && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.carrera}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Semestre
                    </label>
                    <select
                      name="semestre"
                      value={formData.semestre}
                      onChange={handleChange}
                      className={`mt-2 w-full rounded-2xl border ${errors.semestre ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37] appearance-none transition-all`}
                    >
                      <option value="" disabled>
                        Selecciona semestre
                      </option>
                      {semestres.map((opcion, index) => (
                        <option key={index} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                    {errors.semestre && (
                      <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                        {errors.semestre}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Tipo Usuario
                    </label>
                    <select
                      name="tipo_usuario"
                      value={formData.tipo_usuario}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Miembro Activo">Miembro</option>
                      <option value="Ex-miembro">Ex-miembro</option>
                      <option value="Alumno">Alumno</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                    Contraseña {selectedId && "(opcional)"}
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-2 w-full rounded-2xl border ${errors.password ? "border-rose-500" : "border-gray-200"} bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[#D4AF37]`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-[10px] text-rose-600 font-bold uppercase">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Datos físicos */}

                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                    Datos Físicos / Observaciones
                  </label>

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
                  className="w-full rounded-2xl bg-gradient-to-r from-[#800020] to-[#a00028] px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {saving
                    ? "Procesando..."
                    : selectedId
                      ? "Guardar Cambios"
                      : "Registrar Miembro"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
