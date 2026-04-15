import { useState } from "react";
import axios from "axios";

const initialForm = {
  matricula: "",
  name: "",
  email: "",
  carrera: "",
  semestre: "",
  tipo_usuario: "alumno",
  status: "activo",
  datos_fisicos: "",
  historial: "",
  password: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const matriculaPattern = /^\d{8,12}$/;


// Valores válidos para validación
const SEMESTRE_VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const semestres = [
  { value: "1", label: "1er Semestre" },
  { value: "2", label: "2do Semestre" },
  { value: "3", label: "3er Semestre" },
  { value: "4", label: "4to Semestre" },
  { value: "5", label: "5to Semestre" },
  { value: "6", label: "6to Semestre" },
  { value: "7", label: "7mo Semestre" },
  { value: "8", label: "8vo Semestre" },
  { value: "9", label: "9no Semestre" },
  { value: "10", label: "10mo Semestre" },
  { value: "11", label: "11vo Semestre" },
  { value: "12", label: "12vo Semestre" },
];

export function useMemberForm(api, loadMembers, setMessage) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const resetForm = (keepMessage = false) => {
    setSelectedId(null);
    setFormData(initialForm);
    if (!keepMessage) setMessage({ text: "", type: "" });
    setErrors({});
  };

  const startEdit = (member) => {
    setSelectedId(member.id_user);
    setFormData({
      matricula: member.matricula || "",
      name: member.name || "",
      email: member.email || "",
      carrera: member.carrera || "",
      // Normalizamos el semestre: extraemos solo los números
      // para que valores como "1er", "2do" o "6to" se conviertan en "1", "2" o "6"
      semestre: member.semestre != null 
        ? String(member.semestre).replace(/\D/g, "") 
        : "",
      tipo_usuario: member.tipo_usuario || "alumno",
      status: member.status || "activo",
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
      nextErrors.name = "El nombre completo es requerido para el registro.";
    }

    if (!formData.matricula.trim()) {
      nextErrors.matricula = "La matrícula es obligatoria para identificar al alumno.";
    } else if (!matriculaPattern.test(formData.matricula.trim())) {
      nextErrors.matricula = "La matrícula debe ser una secuencia numérica de entre 8 y 12 dígitos. No incluyas letras ni espacios.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "El correo electrónico es indispensable para las notificaciones.";
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "El formato del correo no es válido. Ejemplo: usuario@ues.mx";
    }

    if (!formData.carrera.trim()) {
      nextErrors.carrera = "Debes indicar la carrera técnica o profesional del miembro.";
    }

    if (!formData.semestre.trim()) {
      nextErrors.semestre = "Selecciona el semestre que está cursando el alumno.";
    } else if (!SEMESTRE_VALUES.includes(formData.semestre.trim())) {
      nextErrors.semestre = "El valor del semestre no es válido.";
    }

    if (!selectedId && !formData.password.trim()) {
      nextErrors.password = "La contraseña es necesaria para crear la cuenta del nuevo miembro.";
    } else if (formData.password.trim() && formData.password.length < 6) {
      nextErrors.password = "Por seguridad, la contraseña debe tener una longitud mínima de 6 caracteres.";
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
      return false;
    }

    const payload = {
      matricula: formData.matricula.trim(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      carrera: formData.carrera.trim(),
      semestre: formData.semestre.trim(),
      tipo_usuario: formData.tipo_usuario.trim(),
      status: formData.status.trim(),
      datos_fisicos: (formData.datos_fisicos || "").trim(),
      historial: (formData.historial || "").trim(),
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    if (!selectedId && !payload.password) {
      setMessage({ text: "La contraseña es obligatoria para crear un miembro.", type: "error" });
      setSaving(false);
      return false;
    }

    try {
      if (selectedId) {
        const body = { ...payload };
        if (!body.password) delete body.password;
        await axios.put(`${api}/user/${selectedId}`, body);
        resetForm(true); // Mantener el mensaje de éxito
        setMessage({ text: "Miembro actualizado con éxito.", type: "success" });
      } else {
        await axios.post(`${api}/user`, payload);
        resetForm(true); // Mantener el mensaje de éxito
        setMessage({ text: "Miembro creado correctamente.", type: "success" });
      }
      loadMembers();
      return true;
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      const technicalError = error.response?.data?.error; // Capturar el detalle técnico del backend

      if (serverErrors && typeof serverErrors === "object") {
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
      setMessage({
        text: technicalError ? `${error.response.data.message}: ${technicalError}` : (error.response?.data?.message || "Error al guardar el miembro."),
        type: "error",
      });
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
  return {
    formData,
    errors,
    selectedId,
    saving,
    resetForm,
    handleChange,
    handleSubmit,
    startEdit,
    semestres,
  };
}
