import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
};

const formatHour = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDayKey = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toISOString().slice(0, 10);
};

const countByKey = (items, keyFn) => {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
};

export const Estadisticas = ({ user }) => {
  const [todayRecords, setTodayRecords] = useState([]);
  const [weekRecords, setWeekRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const role = (user.role || user.tipo_usuario || "").toString().toLowerCase();
    const isAdmin = ["admin", "administrador", "superadmin", "administrator"].includes(role);

    if (!isAdmin) {
      setError("Solo administradores pueden ver estas estadísticas.");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const [todayResponse, weekResponse] = await Promise.all([
          axios.get("/api/control/history/today"),
          axios.get("/api/control/history/week"),
        ]);

        setTodayRecords(Array.isArray(todayResponse.data) ? todayResponse.data : []);
        setWeekRecords(Array.isArray(weekResponse.data) ? weekResponse.data : []);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(err.response?.data?.message || "No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  const dailyCounts = useMemo(() => {
    return countByKey(weekRecords, (record) => getDayKey(record.entrada));
  }, [weekRecords]);

  const hourCounts = useMemo(() => {
    return countByKey(weekRecords, (record) => {
      const date = new Date(record.entrada);
      if (Number.isNaN(date.getTime())) return null;
      return date.getHours().toString().padStart(2, "0") + ":00";
    });
  }, [weekRecords]);

  const sortedDays = useMemo(() => {
    return Object.entries(dailyCounts)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => b.count - a.count);
  }, [dailyCounts]);

  const sortedHours = useMemo(() => {
    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [hourCounts]);

  const dailyTrend = useMemo(() => {
    return Object.entries(dailyCounts)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [dailyCounts]);

  const maxDailyCount = useMemo(() => {
    return dailyTrend.reduce((max, item) => Math.max(max, item.count), 0) || 1;
  }, [dailyTrend]);

  const busiestDay = sortedDays[0] || null;
  const quietestDay = sortedDays[sortedDays.length - 1] || null;

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[24px] border border-[#F2EDE8] bg-white p-8 shadow-[0_20px_60px_rgba(92,45,14,0.08)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#3D1E05]">Dashboard de Estadísticas</h1>
              <p className="mt-2 text-sm text-[#8A7060]">Datos de uso para que el administrador identifique los días con más y menos trabajo.</p>
            </div>
            <div className="rounded-2xl bg-[#EFF6FF] px-4 py-3 text-sm font-semibold text-[#1D4ED8]">
              Administrador: <span className="font-black">{user.name}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-[#E7DFCE] bg-[#FEF6DD] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8A7060]">Hoy</p>
              <p className="mt-3 text-4xl font-black text-[#3D1E05]">{todayRecords.length}</p>
              <p className="mt-2 text-sm text-[#4B4B4B]">Entradas registradas</p>
            </div>
            <div className="rounded-[24px] border border-[#E7DFCE] bg-[#EFF2FF] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8A7060]">Últimos 7 días</p>
              <p className="mt-3 text-4xl font-black text-[#3D1E05]">{weekRecords.length}</p>
              <p className="mt-2 text-sm text-[#4B4B4B]">Entradas totales</p>
            </div>
            <div className="rounded-[24px] border border-[#E7DFCE] bg-[#F0FFF4] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8A7060]">Día más ocupado</p>
              <p className="mt-3 text-2xl font-black text-[#166534]">{busiestDay ? formatDateLabel(busiestDay.day) : "N/A"}</p>
              <p className="mt-2 text-sm text-[#4B4B4B]">{busiestDay ? `${busiestDay.count} entradas` : "Sin datos"}</p>
            </div>
            <div className="rounded-[24px] border border-[#E7DFCE] bg-[#FFF1F2] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8A7060]">Día menos ocupado</p>
              <p className="mt-3 text-2xl font-black text-[#991B1B]">{quietestDay ? formatDateLabel(quietestDay.day) : "N/A"}</p>
              <p className="mt-2 text-sm text-[#4B4B4B]">{quietestDay ? `${quietestDay.count} entradas` : "Sin datos"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#F2EDE8] bg-white p-8 shadow-[0_20px_60px_rgba(92,45,14,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#3D1E05]">Tendencias de carga</h2>
              <p className="mt-2 text-sm text-[#8A7060]">Visualiza los días y horarios con mayor movimiento.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
          ) : (
            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              <div className="rounded-[24px] border border-[#E7DFCE] bg-[#FCFCFB] p-6 xl:col-span-2">
                <h3 className="text-lg font-semibold text-[#3D1E05]">Evolución diaria</h3>
                {dailyTrend.length ? (
                  <div className="mt-6 overflow-hidden rounded-[28px] border border-[#E7DFCE] bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#4B4B4B]">Últimos días</span>
                      <span className="text-sm text-[#8A7060]">Registro de entradas</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {dailyTrend.map((item) => (
                        <div key={item.day} className="rounded-2xl bg-[#F7F7F7] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-[#4B4B4B]">{formatDateLabel(item.day)}</span>
                            <span className="text-sm font-black text-[#3D1E05]">{item.count}</span>
                          </div>
                          <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E7E7E7]">
                            <div
                              className="h-full rounded-full bg-[#D4AF37]"
                              style={{ width: `${Math.max(6, (item.count / maxDailyCount) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#8A7060]">Aún no hay datos para mostrar la evolución diaria.</p>
                )}
              </div>

              <div className="rounded-[24px] border border-[#E7DFCE] bg-[#FCFCFB] p-6">
                <h3 className="text-lg font-semibold text-[#3D1E05]">Horarios más activos</h3>
                <div className="mt-4 space-y-3">
                  {sortedHours.map((hour) => (
                    <div key={hour.hour} className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-[#4B4B4B]">{hour.hour}</span>
                        <span className="text-sm font-bold text-[#3D1E05]">{hour.count} registros</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-[#E7E7E7] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#D4AF37]"
                          style={{ width: `${Math.min(100, (hour.count / (sortedHours[0]?.count || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {!sortedHours.length && <p className="text-sm text-[#8A7060]">Aún no hay registros de hora.</p>}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
