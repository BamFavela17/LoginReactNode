import { useState } from "react";
import axios from "axios";

const initialForm = {
  matricula: "",
  name: "",
  email: "",
  carrera: "",
  semestre: "",
  tipo_usuario: "Miembro Activo",
  status: "Activo",
  datos_fisicos: "",
  historial: "",
  password: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const matriculaPattern = /^\d{8,12}$/;
const carreraPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;

export function useMemberForm(api, loadMembers, setMessage) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setSelectedId(null);
    setFormData(initialForm);
    setMessage({ text: "", type: "" });
    setErrors({});
  };

  const startEdit = (member) => {
    setSelectedId(member.id_user);
    setFormData({
      matricula: member.matricula || "",
      name: member.name || "",
      email: member.email || "",
      carrera: member.carrera || "",
      semestre: member.semestre || "",
      tipo_usuario: member.tipo_usuario || "Miembro Activo",
      status: member.status || "Activo",
      datos_fisicos: member.datos_fisicos || "",
      historial: member.historial || "",
      password: "",
    });
    setErrors({});
    setMessage({ text: "", type: "" });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "El nombre es obligatorio.";
    }

    if (!formData.matricula.trim()) {
      nextErrors.matricula = "La matrícula es obligatoria.";
    } else if (!matriculaPattern.test(formData.matricula.trim())) {
      nextErrors.matricula = "La matrícula debe tener entre 8 y 12 dígitos numéricos.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "El correo electrónico es obligatorio.";
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "El correo no tiene un formato válido.";
    }

    if (!formData.carrera.trim()) {
      nextErrors.carrera = "La carrera es obligatoria.";
    } else if (!carreraPattern.test(formData.carrera.trim())) {
      nextErrors.carrera = "La carrera solo puede contener letras y espacios (por ejemplo: Ingeniería de Software o IS).";
    }

    if (!formData.semestre.trim()) {
      nextErrors.semestre = "El semestre es obligatorio.";
    }

    if (!selectedId && !formData.password.trim()) {
      nextErrors.password = "La contraseña es obligatoria para crear un miembro.";
    }

    if (formData.password.trim() && formData.password.length < 6) {
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
      setMessage({ text: "Corrige los errores del formulario para continuar.", type: "error" });
      setSaving(false);
      return;
    }

    const payload = {
      matricula: formData.matricula,
      name: formData.name,
      email: formData.email,
      carrera: formData.carrera,
      semestre: formData.semestre,
      tipo_usuario: formData.tipo_usuario,
      status: formData.status,
      datos_fisicos: formData.datos_fisicos,
      historial: formData.historial,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    if (!selectedId && !payload.password) {
      setMessage({ text: "La contraseña es obligatoria para crear un miembro.", type: "error" });
      setSaving(false);
      return;
    }

    try {
      if (selectedId) {
        const body = { ...payload };
        if (!body.password) delete body.password;
        await axios.put(`${api}/user/${selectedId}`, body);
        setMessage({ text: "Miembro actualizado con éxito.", type: "success" });
      } else {
        await axios.post(`${api}/user`, payload);
        setMessage({ text: "Miembro creado correctamente.", type: "success" });
      }
      resetForm();
      loadMembers();
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
      setMessage({
        text: error.response?.data?.message || "Error al guardar el miembro.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return {
    formData,
    errors,
    selectedId,
    saving,
    resetForm,
    handleChange,
    handleSubmit,
    startEdit,
  };
}
