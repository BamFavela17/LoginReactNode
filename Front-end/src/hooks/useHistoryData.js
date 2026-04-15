import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function useHistoryData(user) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const role = (user.type || user.role || "").toString().toLowerCase();
    if (role !== "user" && role !== "alumno") {
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

  return { historyData, loading, error };
}
