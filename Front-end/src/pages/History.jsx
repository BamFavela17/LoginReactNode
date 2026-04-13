import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const History = ({ user }) => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.type !== "user") {
      setError("Solo los alumnos pueden ver su historial aquí.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`/api/control/history/me`);
        setHistoryData(data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err.response?.data?.message || err.message || "No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const parts = new Intl.DateTimeFormat("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(date);

    const values = parts.reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

    const weekday = values.weekday?.replace(".", "") || "";
    return `${weekday} ${values.day} de ${values.month} del ${values.year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderHistory = () => {
    if (!historyData) {
      return <p className="text-sm text-[#8A7060]">No hay historial disponible aún.</p>;
    }

    if (!historyData.records || historyData.records.length === 0) {
      return <p className="text-sm text-[#8A7060]">Aún no hay registros de visitas.</p>;
    }

    return (
      <div className="space-y-4">
        {historyData.records.map((record, index) => (
          <div key={index} className="rounded-3xl border border-[#E7DFCE] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-[#3D1E05]">{formatDate(record.hora_in)}</p>
              <span className="rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#1E4DB7]">
                {record.estatus || "Finalizado"}
              </span>
            </div>
            <p className="mt-3 text-sm text-[#4B4B4B]">
              Entrada: <span className="font-semibold">{formatTime(record.hora_in)}</span>
            </p>
            <p className="mt-1 text-sm text-[#4B4B4B]">
              Salida: <span className="font-semibold">{record.hora_out ? formatTime(record.hora_out) : "En curso"}</span>
            </p>
            <p className="mt-1 text-sm text-[#4B4B4B]">
              Duración: <span className="font-semibold">{record.duracion}</span>
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[24px] border border-[#F2EDE8] bg-white p-8 shadow-[0_20px_60px_rgba(92,45,14,0.08)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#3D1E05]">Mi Historial</h1>
              <p className="mt-2 text-sm text-[#8A7060]">Aquí puedes ver tus visitas y el registro de tu actividad en el gimnasio.</p>
            </div>
            <div className="rounded-2xl bg-[#FFF2D1] px-4 py-3 text-sm font-semibold text-[#7A3D16]">
              Matrícula: <span className="font-black">{user?.matricula || "-"}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-[#E9DCC4] bg-[#FEF6DD] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8A7060]">Alumno</p>
              <p className="mt-2 text-lg font-bold text-[#3D1E05]">{user?.name}</p>
            </div>
            <div className="rounded-[20px] border border-[#E9DCC4] bg-[#EFF2FF] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8A7060]">Tipo</p>
              <p className="mt-2 text-lg font-bold text-[#3D1E05]">{user?.role || "Alumno"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#F2EDE8] bg-white p-8 shadow-[0_20px_60px_rgba(92,45,14,0.08)]">
          <h2 className="text-2xl font-bold text-[#3D1E05]">Registro de actividad</h2>
          <p className="mt-2 text-sm text-[#8A7060]">El historial se actualiza automáticamente cuando se registra la entrada o salida.</p>

          <div className="mt-6 rounded-[24px] border border-[#E9DCC4] bg-[#FCFCFB] p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
            ) : (
              renderHistory()
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
