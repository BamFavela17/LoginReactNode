import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Sección de Identidad */}
          <div className="space-y-4">
            <p className="text-2xl font-black uppercase tracking-[0.2em] text-[#BC955C]">
              Gimnasio <span className="text-white">UES</span>
            </p>
            <p className="max-w-sm text-sm leading-6 text-slate-300">
              Plataforma integral para la gestión y control de acceso de la comunidad Berrendo. 
              Comprometidos con la excelencia académica y deportiva.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#BC955C]" />
                <span>Hermosillo, Sonora, México</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#BC955C]" />
                <span>soporte.gym@ues.mx</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#BC955C]" />
                <span>(662) 259 4700</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[#BC955C]/80">
              Enlaces rápidos
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                { label: "Inicio", to: "/" },
                { label: "Gestión de Miembros", to: "/gestion-miembros" },
                { label: "Control de Acceso", to: "/access-control" },
                { label: "Historial de Visitas", to: "/history" },
                { label: "Estadísticas UES", to: "/estadisticas" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4 text-[#6A1B31] transition-transform group-hover:translate-x-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recomendación Institucional */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#BC955C]/80">
              Recomendación
            </h3>
            <p className="text-sm leading-6 text-slate-300">
              Es responsabilidad del personal administrativo verificar la vigencia de los seguros estudiantiles antes de autorizar el acceso a las instalaciones.
            </p>
            <div className="rounded-xl border-l-4 border-[#6A1B31] bg-white/5 p-5 text-sm">
              <p className="font-bold text-[#BC955C]">Identidad Berrendo</p>
              <p className="mt-2 text-slate-400 italic">
                "La fuerza de la inteligencia, el espíritu de nuestra voluntad."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Copyright */}
      <div className="border-t border-slate-800 bg-[#0f0f0f] py-6">
        <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center text-[10px] uppercase tracking-widest text-slate-500 sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Universidad Estatal de Sonora. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#BC955C] cursor-help">Aviso de Privacidad</span>
            <span className="text-[#6A1B31]">|</span>
            <span className="hover:text-[#BC955C] cursor-help">Normatividad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};