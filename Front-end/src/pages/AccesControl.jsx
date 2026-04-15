import React from "react";
import {
  UserCheck,
  UserMinus,
  Users,
  Search,
  AlertCircle,
  Clock,
  MapPin,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAccessControl } from "../hooks/useAccessControl";

export const AccessControl = ({ adminUser }) => {
  const {
    matricula,
    setMatricula,
    searchTerm,
    setSearchTerm,
    message,
    historyMatricula,
    setHistoryMatricula,
    historyData,
    loadingHistory,
    fetchHistory,
    handleAction,
    liveUsers,
    filteredLiveUsers,
  } = useAccessControl(adminUser);

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "—";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const renderHistoryContent = (historial) => {
    if (!historial) {
      return (
        <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">
          No hay historial disponible para esta matrícula.
        </p>
      );
    }

    let parsed = historial;
    if (typeof historial === "string") {
      try {
        parsed = JSON.parse(historial);
      } catch (error) {
        parsed = historial;
      }
    }

    if (Array.isArray(parsed) && parsed.length > 0) {
      return (
        <div className="space-y-3">
          {parsed.map((entry, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                Fecha
              </p>
              <p className="font-black text-sm text-[#800020] mb-2">
                {entry.fecha}
              </p>
              <div className="flex gap-4 text-[11px] uppercase tracking-[0.25em] text-slate-500">
                <span>Entrada: {entry.entrada || "N/A"}</span>
                <span>Salida: {entry.salida || "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (typeof parsed === "object") {
      return (
        <pre className="whitespace-pre-wrap text-xs text-slate-600 bg-white border border-slate-200 rounded-2xl p-4 overflow-x-auto">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    }

    return (
      <pre className="whitespace-pre-wrap text-xs text-slate-600 bg-white border border-slate-200 rounded-2xl p-4 overflow-x-auto">
        {parsed}
      </pre>
    );
  };



  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 w-full">
          <div className="flex items-center gap-5 min-w-0">
            <div className="bg-[#800020] p-4 rounded-2xl shadow-lg shadow-red-900/20">
              <LayoutDashboard className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-black text-[#800020] uppercase tracking-tight leading-none break-words">
                Panel de Control
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-2 flex items-center gap-2 break-words">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
                Gestión de Flujo y Aforo Institucional
              </p>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 hidden md:block">
            <p className="text-[10px] font-black text-slate-400 uppercase">
              Operador Activo
            </p>
            <p className="text-sm font-bold text-[#800020] italic">
              {adminUser?.name || "Administrador"}
            </p>
          </div>
          <Link
              to="/"
              className="inline-flex items-center justify-center rounded-[16px] border border-[#D4AF37] bg-[#FFF5D0] px-5 py-3 text-sm font-bold text-[#7A3D16] transition hover:bg-[#F7E3A8]"
            >
              Volver al inicio
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full">
            {/* Card de Registro Principal - Mejorada */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              {/* Header con gradiente mejorado */}
              <div className="bg-gradient-to-br from-[#800020] via-[#8B0028] to-[#a00028] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <Search className="text-[#D4AF37] w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-white font-black uppercase tracking-wider text-base sm:text-lg">
                    Control de Acceso
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-red-200/80 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
                    Número de Matrícula
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      placeholder="Ej: 21920000"
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/10 border-2 border-white/20 focus:border-[#D4AF37] focus:bg-white text-white focus:text-[#800020] rounded-xl outline-none transition-all font-bold text-lg sm:text-2xl placeholder:text-white/30 hover:bg-white/20"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAction("in")
                      }
                      autoFocus
                    />
                    {matricula && (
                      <button
                        onClick={() => setMatricula("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-[8px] sm:text-[9px] text-red-200/50 uppercase tracking-wider">
                    Ingresa los 8 dígitos de la matrícula
                  </p>
                </div>
              </div>

              {/* Cuerpo del formulario */}
              <div className="p-5 sm:p-6 md:p-8 bg-white space-y-5 sm:space-y-6">
                {/* Mensaje de alerta mejorado */}
                {message.text && (
                  <div
                    className={`p-4 rounded-xl flex items-start gap-3 border-l-4 animate-slideDown ${
                      message.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                        : "bg-rose-50 text-rose-700 border-rose-500"
                    }`}
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase leading-tight">
                        {message.text}
                      </p>
                      <p className="text-[9px] opacity-75 mt-1">
                        {message.type === "success"
                          ? "Operación completada exitosamente"
                          : "Por favor verifica los datos"}
                      </p>
                    </div>
                    <button
                      onClick={() => setMessage({ text: "", type: "" })}
                      className="text-current opacity-50 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Botones de acción mejorados */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => handleAction("in")}
                    className="group relative overflow-hidden bg-gradient-to-r from-[#800020] to-[#a00028] text-white rounded-xl hover:shadow-xl transition-all active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="p-4 sm:p-5 flex flex-col items-center gap-2 relative z-10">
                      <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                        <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                        Registrar Entrada
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-white/70 uppercase">
                        Check-In
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAction("out")}
                    className="group bg-slate-50 border-2 border-slate-200 text-[#800020] rounded-xl hover:bg-white hover:border-[#800020] hover:shadow-lg transition-all active:scale-95"
                  >
                    <div className="p-4 sm:p-5 flex flex-col items-center gap-2">
                      <div className="bg-slate-100 p-2 rounded-full group-hover:bg-[#800020]/10 transition-colors">
                        <UserMinus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                        Registrar Salida
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-slate-400 uppercase">
                        Check-Out
                      </span>
                    </div>
                  </button>
                </div>

                {/* Recordatorio mejorado */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500 p-2 rounded-lg text-white shadow-lg shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-amber-800 font-black uppercase leading-relaxed">
                        📋 Protocolo de Seguridad
                      </p>
                      <p className="text-[9px] text-amber-700 font-medium leading-relaxed mt-1">
                        El alumno debe presentar su credencial física o digital
                        para validar su identidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: MONITOR */}
          <div className="lg:col-span-9 flex flex-col h-full">
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden flex flex-col h-full min-h-full">
              <div className="p-8 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 min-w-0 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Users size={28} />
                  </div>
                  <div>
                    <h2 className="text-[#800020] font-black uppercase text-xl tracking-tight">
                      MONITOREO
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Vista en tiempo real de ingresos activos
                    </p>
                  </div>
                </div>
                <div className="bg-[#800020] text-white px-6 py-2 rounded-2xl shadow-lg flex items-center gap-3">
                  <span className="text-xl font-black">{liveUsers.length}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest border-l border-white/20 pl-3 leading-none">
                    Alumnos
                    <br />
                    en Planta
                  </span>
                </div>
              </div>

              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  {filteredLiveUsers.length} de {liveUsers.length} registros mostrados
                </div>
                <div className="w-full sm:w-80">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por matrícula, nombre, correo o carrera"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#800020] focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>
              </div>

              <div className="flex-grow overflow-x-auto overflow-y-auto max-h-[24rem]">
                <table className="table-auto min-w-[720px] w-full text-left">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Perfil Alumno
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                        Entrada
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                        Estado
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                        Tiempo
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                        Control
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLiveUsers.length > 0 ? (
                      filteredLiveUsers.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/50 transition-all group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-sm font-black text-[#800020] shadow-inner group-hover:bg-[#800020] group-hover:text-[#D4AF37] transition-all">
                                {item.nombre_alumno?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-black text-[#800020] text-base uppercase leading-none mb-1">
                                  {item.nombre_alumno}
                                </div>
                                <div className="text-[11px] text-slate-500 font-bold">
                                  <span className="text-[#D4AF37] font-black mr-2">
                                    ID: {item.matricula}
                                  </span>
                                  <span className="uppercase tracking-tighter opacity-60">
                                    / {item.carrera}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className="flex flex-col items-center gap-1 text-[#800020] font-black text-sm bg-white border border-slate-100 py-3 px-4 rounded-2xl w-max mx-auto shadow-sm">
                              <span className="flex items-center gap-2">
                                <Clock size={16} className="text-[#D4AF37]" />
                                {formatDateTime(item.entrada)}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span
                              className={`px-3 py-2 rounded-full text-[11px] font-black uppercase ${item.estatus === "DENTRO" ? "bg-green-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                            >
                              {item.estatus}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-sm font-black text-[#800020] uppercase">
                              {item.tiempo_transcurrido || "En curso..."}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => {
                                setMatricula(item.matricula);
                                handleAction("out");
                              }}
                              className="opacity-0 group-hover:opacity-100 bg-[#800020] text-white p-3 rounded-xl hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all"
                              title="Registrar Salida Rápida"
                            >
                              <UserMinus size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-32 text-center">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-6 bg-slate-100 rounded-full">
                              <Users size={56} className="text-slate-300" />
                            </div>
                            <p className="text-lg font-black text-slate-300 uppercase italic tracking-widest">
                              Gimnasio Despejado
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                              Sin entradas activas en el sistema.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
