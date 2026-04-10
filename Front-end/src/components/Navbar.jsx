import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Usamos iconos que denoten academia y deporte
import { LogOut, LogIn, UserPlus, Dumbbell, ShieldCheck, GraduationCap } from 'lucide-react';

export const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
    } catch (error) {
      console.error("Error durante el logout:", error);
    }
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-[#800020] shadow-md">
      {/* Franja superior delgada en color Oro (Identidad UES) */}
      <div className="h-1.5 w-full bg-[#D4AF37]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Identidad UES Sonora */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="bg-[#800020] p-2.5 rounded-br-2xl rounded-tl-2xl transform group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Dumbbell className="w-7 h-7 text-[#D4AF37]" />
              </div>
            </div>
            
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-[#800020] tracking-tighter uppercase">
                GYM<span className="text-[#D4AF37]">UES</span>
              </span>
              <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                Estado de Sonora
              </span>
            </div>
          </Link>

          {/* Enlaces de Navegación */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                {/* Badge de Alumno/Berrendo */}
                <div className="hidden lg:flex items-center space-x-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="bg-[#D4AF37] p-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#800020]" />
                  </div>
                  <div className="flex flex-col ">
                    <span className="text-[10px] text-gray-400 font-black uppercase">Comunidad UES</span>
                    <span className="text-[#800020] text-xs font-black uppercase tracking-wide">
                      {user.name || 'Berrendo'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-500 hover:text-[#800020] font-bold uppercase text-xs transition-all duration-200 group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link
                  to="/login"
                  className="text-[#800020] hover:text-[#D4AF37] font-black uppercase text-xs tracking-widest transition-colors border-b-2 border-transparent hover:border-[#D4AF37]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-[#800020] hover:bg-[#600018] text-white font-black uppercase text-xs px-6 py-3 rounded-md transition-all duration-300 shadow-lg flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Registrarse</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};