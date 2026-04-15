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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const STAFF_ROLES_OPTIONS = ["staff", "superadmin", "entrenador", "admin", "recepcionista"];

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
  const [errors, setErrors] = useState({});
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
    setErrors({});
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
    setErrors({});
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

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    }
    if (!formData.username.trim()) {
      nextErrors.username = "El nombre de usuario es requerido para el inicio de sesión.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "El correo electrónico es obligatorio.";
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "Ingresa un formato de correo válido (ejemplo@ues.mx).";
    }
    if (!formData.role.trim()) {
      nextErrors.role = "Debes asignar un rol al usuario.";
    }

    if (!selectedId && !formData.password.trim()) {
      nextErrors.password = "La contraseña es obligatoria para nuevos registros.";
    } else if (formData.password.trim() && formData.password.length < 6) {
      nextErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    if (event?.preventDefault) event.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setMessage({ text: "Revisa los campos marcados en rojo.", type: "error" });
      setSaving(false);
      return false;
    }

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
      return true;
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
      setMessage({ text: err.response?.data?.message || "Error al procesar la solicitud.", type: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
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
    errors,
    resetForm,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleChange,
    totalStaff,
    superadmins,
  };
}
