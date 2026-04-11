import React from "react";

const NoFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3D1E09] px-4 text-center">
      <div className="rounded-[24px] bg-white/90 px-8 py-12 shadow-2xl backdrop-blur sm:px-12">
        <p className="text-6xl font-black text-[#800020]">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Página no encontrada</h1>
        <p className="mt-2 text-sm text-slate-600">La ruta que solicitaste no existe o no está disponible.</p>
      </div>
    </div>
  );
};

export default NoFound;
