import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const getDayKey = (dateString) => {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

const countByKey = (items, keyFn) => {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
};

const safeDate = (dateString) => {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function useStatistics(user) {
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

  const dailyCounts = useMemo(() => countByKey(weekRecords, (record) => getDayKey(record.entrada)), [weekRecords]);

  const hourCounts = useMemo(
    () =>
      countByKey(weekRecords, (record) => {
        const date = safeDate(record.entrada);
        return date ? date.getHours().toString().padStart(2, "0") + ":00" : null;
      }),
    [weekRecords],
  );

  const sortedDays = useMemo(
    () =>
      Object.entries(dailyCounts)
        .map(([day, count]) => ({ day, count }))
        .sort((a, b) => b.count - a.count),
    [dailyCounts],
  );

  const sortedHours = useMemo(
    () =>
      Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    [hourCounts],
  );

  const dailyTrend = useMemo(
    () =>
      Object.entries(dailyCounts)
        .map(([day, count]) => ({ day, count }))
        .sort((a, b) => a.day.localeCompare(b.day)),
    [dailyCounts],
  );

  const maxDailyCount = useMemo(
    () => dailyTrend.reduce((max, item) => Math.max(max, item.count), 0) || 1,
    [dailyTrend],
  );

  const busiestDay = sortedDays[0] || null;
  const quietestDay = sortedDays[sortedDays.length - 1] || null;

  return {
    todayRecords,
    weekRecords,
    loading,
    error,
    dailyTrend,
    sortedHours,
    busiestDay,
    quietestDay,
    maxDailyCount,
  };
}
