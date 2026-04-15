import { useEffect, useState } from "react";
import axios from "axios";

const searchableFields = ["name", "matricula", "carrera", "email", "tipo_usuario"];

export function useMembers(api) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const loadMembers = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.get(`${api}/users`);
      setMembers(data);
      setFilteredMembers(data);
    } catch (error) {
      setMessage({ text: "No se pudo cargar la lista de miembros.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar definitivamente este miembro?")) return;

    try {
      await axios.delete(`${api}/user/${id}`);
      setMessage({ text: "Miembro eliminado correctamente.", type: "success" });
      loadMembers();
    } catch (error) {
      setMessage({ text: "No se pudo eliminar el miembro.", type: "error" });
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredMembers(members);
      return;
    }

    setFilteredMembers(
      members.filter((member) =>
        searchableFields
          .map((field) => member[field] || "")
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, members]);

  const activeCount = members.filter((member) => member.status?.toLowerCase() === "activo").length;

  return {
    members,
    filteredMembers,
    loading,
    search,
    setSearch,
    message,
    setMessage,
    loadMembers,
    handleDelete,
    activeCount,
  };
}
