import React from "react";
import { Link } from "react-router-dom";

const routineSections = [
  {
    id: "full-body",
    title: "Rutina Completa",
    method: "Entrenamiento Full Body",
    description:
      "Incluye ejercicios compuestos que trabajan todo el cuerpo en una sola sesión. Ideal para mejorar fuerza general y condición física.",
    exercises: [
      "Sentadillas con peso corporal o barra",
      "Press de pecho o flexiones",
      "Remo con mancuernas o barra",
      "Peso muerto rumano",
      "Plancha y mountain climbers",
    ],
    focus: "Cuerpo entero",
  },
  {
    id: "upper-body",
    title: "Parte Superior",
    method: "Entrenamiento de Fuerza",
    description:
      "Enfocado en hombros, pecho, espalda y brazos. Mejora la postura, la estabilidad del torso y la fuerza de empuje/tirón.",
    exercises: [
      "Press militar o push press",
      "Dominadas o jalones",
      "Fondos en paralelas o dips",
      "Curl de bíceps con mancuernas",
      "Face pulls o remo al mentón",
    ],
    focus: "Pecho, espalda, hombro y brazos",
  },
  {
    id: "lower-body",
    title: "Parte Inferior",
    method: "Entrenamiento de Potencia",
    description:
      "Trabaja piernas y glúteos con movimientos esenciales que aumentan la fuerza, la estabilidad y la capacidad de salto.",
    exercises: [
      "Sentadilla frontal o trasera",
      "Zancadas o lunges",
      "Peso muerto con piernas rígidas",
      "Elevaciones de talones (gemelos)",
      "Puente de glúteos o hip thrust",
    ],
    focus: "Piernas y glúteos",
  },
  {
    id: "core-conditioning",
    title: "Core & Movilidad",
    method: "Entrenamiento Funcional",
    description:
      "Desarrolla un core fuerte y movilidad articular. Perfecto para proteger la columna y mejorar el rendimiento en todos los ejercicios.",
    exercises: [
      "Plancha frontal y lateral",
      "Elevaciones de piernas",
      "Bird dog",
      "Puente de cadera",
      "Rotaciones de tronco con banda",
    ],
    focus: "Abdomen, estabilidad y movilidad",
  },
];

export const Rutinas = () => {
  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[28px] border border-[#F2EDE8] bg-white p-8 shadow-[0_24px_80px_rgba(92,45,14,0.08)]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8A7060]">Rutinas</p>
              <h1 className="mt-3 text-4xl font-black text-[#3D1E05]">Entrenamientos estructurados</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7A3D16]">
                Escoge entre rutinas completas o programas por grupos musculares que combinan métodos como fuerza, potencia, funcionalidad y movilidad.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-[16px] border border-[#D4AF37] bg-[#FFF5D0] px-5 py-3 text-sm font-bold text-[#7A3D16] transition hover:bg-[#F7E3A8]"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {routineSections.map((section) => (
              <article key={section.id} className="group overflow-hidden rounded-[24px] border border-[#E7DFCE] bg-[#FFFDF8] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#8A7060]">{section.method}</p>
                    <h2 className="mt-3 text-2xl font-black text-[#3D1E05]">{section.title}</h2>
                  </div>
                  <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7A3D16]">
                    {section.focus}
                  </span>
                </div>
                <p className="mb-5 text-sm leading-7 text-[#5B4A33]">{section.description}</p>
                <ul className="space-y-3">
                  {section.exercises.map((exercise) => (
                    <li key={exercise} className="flex items-start gap-3 text-sm text-[#4B4B4B]">
                      <span className="mt-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-black text-white">•</span>
                      <span>{exercise}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-[#E9DCC4] bg-[#FDF8EF] p-6 text-sm leading-7 text-[#5B4A33] shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-[#3D1E05]">Cómo usar estas rutinas</h3>
            <p className="mb-3">
              Puedes alternar entre sesiones de cuerpo completo y sesiones específicas según tu objetivo. Por ejemplo, realiza 2 entrenamientos de parte inferior y 1 de parte superior junto a una sesión de core cada semana.
            </p>
            <p>
              Recuerda calentar antes de entrenar y enfriar al finalizar. Si buscas fuerza, elige cargas moderadas a altas con pocas repeticiones. Si buscas acondicionamiento, usa circuitos con menos descanso y repeticiones controladas.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
