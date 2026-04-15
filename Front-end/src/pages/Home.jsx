import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user, error }) {
  // Manejo robusto de iniciales: toma las primeras dos letras del nombre o "UG" como fallback
  const initials = user?.name 
    ? user.name.trim().split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() 
    : "UG";

  // Lógica de roles normalizada
  const rawRole = (user?.role || user?.tipo_usuario || "").toString().toLowerCase();
  
  const isSuperAdmin = rawRole === "superadmin";
  const isAdmin = ["admin", "administrador", "administrator", "superadmin"].includes(rawRole);
  const isStaff = rawRole === "staff";
  // Un alumno es alguien que no es admin ni staff (incluye los tipos: alumno, docente, externo, etc.)
  const isAlumno = user && !isAdmin && !isStaff;

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-10 sm:px-10 lg:px-14">
      {error && (
        <div className="mx-auto max-w-6xl mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2">
          ⚠️ {error}
        </div>
      )}

      {user ? (
        <div className="mx-auto max-w-6xl space-y-10">
          {/* SECCIÓN BIENVENIDA */}
          <section className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-[0.08em] text-[#3D1E05]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                ¡Bienvenido, <span className="text-[#C17D0E]">{user.name}</span>!
              </h1>
              <p className="max-w-2xl text-sm text-[#8A7060]">Has iniciado sesión correctamente en el sistema GymUES.</p>
            </div>

            <div className="flex flex-col gap-4 rounded-[20px] border border-[#F2EDE8] bg-white p-7 shadow-[0_4px_20px_rgba(92,45,14,0.08)] sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F5A623] to-[#7A3D16] text-2xl font-black text-white shadow-lg ring-4 ring-[#FFF5D0]">
                {initials}
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black text-[#2A1505] leading-tight">{user.name}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-[#C17D0E]">
                  {user.role || user.tipo_usuario || "Miembro"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:ml-auto">
                 <Link to="/settings" className="text-sm font-bold text-[#F5A623] hover:text-[#C17D0E] transition-colors">
                  Ver perfil
                </Link>
                <div className="rounded-2xl bg-[#FFF2D1] px-4 py-2 text-xs font-black text-[#7A3D16] border border-[#F7E3A8]">
                  {user.email}
                </div>
              </div>
            </div>
          </section>

          {/* ACCESOS DISPONIBLES */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-[#3D1E05] flex items-center gap-2">
              <span className="h-1 w-8 bg-[#D4AF37] rounded-full"></span>
              Accesos disponibles
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Vistas para Administradores */}
              {isAdmin && (
                <>
                  <Link to="/access-control" className="group relative overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">🔐</div>
                    <h3 className="mb-2 text-lg font-bold text-[#3D1E05]">Control de Acceso</h3>
                    <p className="text-sm text-[#8A7060]">Gestiona entradas y salidas en tiempo real.</p>
                  </Link>

                  <Link to="/members" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">👥</div>
                    <h3 className="mb-2 text-lg font-bold text-[#3D1E05]">Gestión de Miembros</h3>
                    <p className="text-sm text-[#8A7060]">Administra alumnos, docentes y externos.</p>
                  </Link>

                  <Link to="/estadisticas" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">📊</div>
                    <h3 className="mb-2 text-lg font-bold text-[#3D1E05]">Estadísticas</h3>
                    <p className="text-sm text-[#8A7060]">Análisis de carga y patrones de uso.</p>
                  </Link>

                  {isSuperAdmin && (
                    <Link to="/employees" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl ring-2 ring-[#FFF5D0]">
                      <div className="mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">💼</div>
                      <h3 className="mb-2 text-lg font-bold text-[#3D1E05]">Staff & Empleados</h3>
                      <p className="text-sm text-[#8A7060]">Configura roles y personal administrativo del sistema.</p>
                    </Link>
                  )}
                </>
              )}

              {/* Vistas para Staff que no es Admin */}
              {isStaff && !isAdmin && (
                <Link to="/access-control" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 text-3xl">🔐</div>
                  <h3 className="mb-2 text-lg font-bold text-[#3D1E05]">Control de Acceso</h3>
                  <p className="text-sm text-[#8A7060]">Registra entradas y salidas desde tu estación.</p>
                </Link>
              )}

              {/* Vistas para Alumnos/Docentes/Externos */}
              {isAlumno && (
                <>
                  <Link to="/history" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 text-3xl group-hover:rotate-12 transition-transform">🕒</div>
                    <h3 className="mb-2 text-lg font-bold text-[#3D1E05]">Mi Historial</h3>
                    <p className="text-sm text-[#8A7060]">Consulta tus visitas y tiempo en el gimnasio.</p>
                  </Link>
                  <Link to="/rutinas" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 text-3xl group-hover:rotate-12 transition-transform">📋</div>
                    <h3 className="mb-2 text-lg font-bold text-[#3D1E05]">Mis Rutinas</h3>
                    <p className="text-sm text-[#8A7060]">Revisa tus ejercicios y planes personalizados.</p>
                  </Link>
                </>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* ESTADO NO AUTENTICADO */
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="w-full max-w-md rounded-[32px] border border-white bg-white/40 p-10 shadow-2xl backdrop-blur-2xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#800020] to-[#3D1E09] text-4xl shadow-xl">
              🔐
            </div>
            <h2 className="text-3xl font-black uppercase tracking-widest text-[#3D1E09]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Acceso Restringido
            </h2>
            <p className="mt-4 text-sm font-medium text-[#8A7060] leading-relaxed">
              Inicia sesión con tus credenciales universitarias para gestionar tu acceso al gimnasio UES.
            </p>

            <div className="mt-8 grid gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-[#800020] px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                INICIAR SESIÓN
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-[#800020]/10 bg-white/50 px-5 py-4 text-sm font-black uppercase tracking-widest text-[#800020] transition-all hover:bg-white active:scale-95"
              >
                REGISTRARSE
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}