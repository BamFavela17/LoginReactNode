import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user, error }) {
  // Iniciales del avatar
  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "UG";

  return (
    <>
      {/* Error global */}
      {error && (
        <div className="ues-error" style={{ margin: "16px 32px" }}>
          ⚠️ {error}
        </div>
      )}

      {user ? (
        /* ── USUARIO LOGUEADO ── */
        <div className="ues-home">
          <div className="ues-welcome">

            <div className="ues-welcome__header">
              <h1 className="ues-welcome__greeting">
                ¡Bienvenido, <span>{user.name}</span>!
              </h1>
              <p className="ues-welcome__sub">Has iniciado sesión correctamente.</p>
            </div>

            {/* Tarjeta de usuario */}
            <div className="ues-user-card">
              <div className="ues-user-card__avatar">{initials}</div>
              <div className="ues-user-card__info">
                <strong>{user.name}</strong>
                <span>Estudiante UES</span>
              </div>
              <div className="ues-user-card__email">{user.email}</div>
            </div>

            {/* Stats decorativas */}
            <div className="ues-stats-row">
              <div className="ues-stat">
                <div className="ues-stat__icon">🏋️</div>
                <div className="ues-stat__value">34</div>
                <div className="ues-stat__label">En el Gym ahora</div>
              </div>
              <div className="ues-stat">
                <div className="ues-stat__icon">💳</div>
                <div className="ues-stat__value">Activa</div>
                <div className="ues-stat__label">Tu Membresía</div>
              </div>
              <div className="ues-stat">
                <div className="ues-stat__icon">📋</div>
                <div className="ues-stat__value">12</div>
                <div className="ues-stat__label">Visitas este mes</div>
              </div>
            </div>

          </div>
        </div>

      ) : (
        /* ── USUARIO NO LOGUEADO ── */
        <div className="ues-home__gate">
          <div className="ues-gate-card">
            <div className="ues-gate-card__icon">🔐</div>
            <h2 className="ues-gate-card__title">Necesitas Iniciar Sesión</h2>
            <p className="ues-gate-card__sub">
              Accede al sistema de gestión del gimnasio UES
            </p>
            <Link to="/login">
              <button className="btn-ues btn-ues--gold">INICIAR SESIÓN</button>
            </Link>
            <Link to="/register">
              <button className="btn-ues btn-ues--ghost">REGISTRARSE</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}