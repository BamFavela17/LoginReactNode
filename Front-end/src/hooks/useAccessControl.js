import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "/api/control";

export function useAccessControl(adminUser) {
  const [matricula, setMatricula] = useState("");
  const [liveUsers, setLiveUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [historyMatricula, setHistoryMatricula] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchLiveStatus = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/monitor`);
      setLiveUsers(data);
    } catch (err) {
      console.error("Error al cargar monitoreo", err);
      setMessage({ text: "No se pudo cargar el monitoreo en vivo.", type: "error" });
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    if (!historyMatricula) {
      setHistoryData(null);
      return;
    }

    setLoadingHistory(true);
    try {
      const { data } = await axios.get(`${API_BASE}/history/${historyMatricula}`);
      setHistoryData(data);
    } catch (err) {
      setHistoryData({
        error: err.response?.data?.message || "No se encontró historial",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAction = async (actionType) => {
    if (!matricula) return;
    setMessage({ text: "", type: "" });

    try {
      const endpoint = actionType === "in" ? "/in" : "/out";
      const adminId = adminUser?.id_admin || adminUser?.id;

      if (actionType === "in" && !adminId) {
        setMessage({
          text: "Error de sesión: Admin no identificado.",
          type: "error",
        });
        return;
      }

      const payload = actionType === "in" ? { matricula, id_admin: adminId } : { matricula };
      const { data } = await axios({
        method: actionType === "in" ? "post" : "put",
        url: `${API_BASE}${endpoint}`,
        data: payload,
      });

      setMessage({ text: data.message, type: "success" });
      setMatricula("");
      fetchLiveStatus();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error en el servidor",
        type: "error",
      });
    }
  };

  const sortedLiveUsers = useMemo(
    () => [...liveUsers].sort((a, b) => new Date(b.entrada) - new Date(a.entrada)),
    [liveUsers],
  );

  const filteredLiveUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sortedLiveUsers;

    return sortedLiveUsers.filter((item) =>
      [item.matricula, item.nombre_alumno, item.email, item.carrera]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(term)),
    );
  }, [searchTerm, sortedLiveUsers]);

  return {
    matricula,
    setMatricula,
    liveUsers,
    searchTerm,
    setSearchTerm,
    message,
    historyMatricula,
    setHistoryMatricula,
    historyData,
    loadingHistory,
    fetchHistory,
    handleAction,
    filteredLiveUsers,
  };
}
