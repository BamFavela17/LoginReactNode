import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const initialForm = {
  name: "",
  lastname: "",
  username: "",
  email: "",
  role: "staff",
  password: "",
};

const searchableFields = ["name", "lastname", "username", "email", "role"];

export function useStaffManagement() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState(initialForm);
  const api = "/api/users";

  const fetchStaff = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.get(`${api}/admins`);
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setMessage({ text: "No se pudo cargar el personal de staff.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredStaff(staff);
      return;
    }

    setFilteredStaff(
      staff.filter((admin) =>
        searchableFields
          .map((field) => admin[field] || "")
          .join(" ")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [search, staff]);

  const resetForm = () => {
    setSelectedId(null);
    setFormData(initialForm);
    setMessage({ text: "", type: "" });
  };

  const handleEdit = (admin) => {
    setSelectedId(admin.id_admin);
    setFormData({
      name: admin.name || "",
      lastname: admin.lastname || "",
      username: admin.username || "",
      email: admin.email || "",
      role: admin.role || "staff",
      password: "",
    });
    setMessage({ text: "", type: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este miembro del staff definitivamente?")) return;

    try {
      await axios.delete(`${api}/admin/${id}`);
      setMessage({ text: "Persona de staff eliminada correctamente.", type: "success" });
      fetchStaff();
    } catch (err) {
      setMessage({ text: "No se pudo eliminar el staff.", type: "error" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    const payload = {
      name: formData.name,
      lastname: formData.lastname,
      username: formData.username,
      email: formData.email,
      role: formData.role,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    if (!selectedId && !formData.password) {
      setMessage({ text: "La contraseña es obligatoria para crear staff.", type: "error" });
      setSaving(false);
      return;
    }

    try {
      if (selectedId) {
        await axios.put(`${api}/admin/${selectedId}`, payload);
        setMessage({ text: "Staff actualizado con éxito.", type: "success" });
      } else {
        await axios.post(`${api}/admin`, payload);
        setMessage({ text: "Staff creado correctamente.", type: "success" });
      }
      resetForm();
      fetchStaff();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error al guardar el staff.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalStaff = staff.length;
  const superadmins = staff.filter((item) => item.role === "superadmin").length;

  return {
    staff,
    filteredStaff,
    loading,
    saving,
    selectedId,
    search,
    setSearch,
    message,
    formData,
    errors: {},
    resetForm,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleChange,
    totalStaff,
    superadmins,
  };
}
