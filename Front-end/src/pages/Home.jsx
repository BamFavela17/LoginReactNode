import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user, error }) {
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "UG";

  const role = (user?.role || user?.tipo_usuario || "alumno").toString().toLowerCase();
  const isAdmin = ["admin", "administrador", "superadmin", "administrator"].includes(role);
  const isStaff = role === "staff";
  const isAlumno = !isAdmin && !isStaff;

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-10 sm:px-10 lg:px-14">
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {user ? (
        <div className="mx-auto max-w-6xl space-y-10">
          <section className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-[0.08em] text-[#3D1E05]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                ¡Bienvenido, <span className="text-[#C17D0E]">{user.name}</span>!
              </h1>
              <p className="max-w-2xl text-sm text-[#8A7060]">Has iniciado sesión correctamente.</p>
            </div>

            <div className="flex flex-col gap-4 rounded-[20px] border border-[#F2EDE8] bg-white p-7 shadow-[0_4px_20px_rgba(92,45,14,0.08)] sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F5A623] to-[#7A3D16] text-3xl font-black text-white shadow-lg">
                {initials}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-black text-[#2A1505]">{user.name}</p>
                <p className="text-sm text-[#8A7060]">{user.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Estudiante UES"}</p>
              </div>
              <div className="mt-3 rounded-2xl bg-[#FFF2D1] px-4 py-3 text-sm font-semibold text-[#7A3D16] sm:ml-auto sm:mt-0">
                {user.email}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#3D1E05]">Accesos disponibles</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {isAdmin && (
                <>
                  <Link to="/access-control" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 text-3xl">🔐</div>
                    <h3 className="mb-2 text-lg font-semibold text-[#3D1E05]">Control de Acceso</h3>
                    <p className="text-sm text-[#8A7060]">Gestiona entradas y salidas en tiempo real.</p>
                  </Link>

                  <Link to="/members" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 text-3xl">👥</div>
                    <h3 className="mb-2 text-lg font-semibold text-[#3D1E05]">Gestión de Miembros</h3>
                    <p className="text-sm text-[#8A7060]">Administra alumnos, membresías y datos de contacto.</p>
                  </Link>

                  <Link to="/employees" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 text-3xl">💼</div>
                    <h3 className="mb-2 text-lg font-semibold text-[#3D1E05]">Staff & Empleados</h3>
                    <p className="text-sm text-[#8A7060]">Configura roles y personal administrativo.</p>
                  </Link>
                </>
              )}

              {isStaff && (
                <Link to="/access-control" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 text-3xl">🔐</div>
                  <h3 className="mb-2 text-lg font-semibold text-[#3D1E05]">Control de Acceso</h3>
                  <p className="text-sm text-[#8A7060]">Registra entradas y salidas desde tu estación de trabajo.</p>
                </Link>
              )}

              {isAlumno && (
                <>
                  <Link to="/access-control" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 text-3xl">🔐</div>
                    <h3 className="mb-2 text-lg font-semibold text-[#3D1E05]">Ingresar / Salir</h3>
                    <p className="text-sm text-[#8A7060]">Registra tu entrada y salida del gimnasio.</p>
                  </Link>
                  <Link to="/rutinas" className="group overflow-hidden rounded-[20px] border border-[#F2EDE8] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 text-3xl">📋</div>
                    <h3 className="mb-2 text-lg font-semibold text-[#3D1E05]">Mis Rutinas</h3>
                    <p className="text-sm text-[#8A7060]">Revisa tus ejercicios y planes asignados.</p>
                  </Link>
                </>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="w-full max-w-md rounded-[24px] border border-white/15 bg-white/70 p-10 shadow-[0_40px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            <div className="mb-8 text-center text-[#3D1E09]">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#F5A623] to-[#C17D0E] text-4xl text-white shadow-lg">
                🔐
              </div>
              <h2 className="text-3xl font-black uppercase tracking-[0.08em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Necesitas Iniciar Sesión
              </h2>
              <p className="mt-3 text-sm text-[#8A7060]">Accede al sistema de gestión del gimnasio UES</p>
            </div>

            <div className="grid gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-[16px] bg-gradient-to-r from-[#F5A623] to-[#C17D0E] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3D1E09] shadow-[0_8px_24px_rgba(245,166,35,0.3)] transition hover:-translate-y-0.5"
              >
                INICIAR SESIÓN
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-[16px] border border-white/20 bg-white/80 px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#3D1E09] transition hover:bg-white"
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
