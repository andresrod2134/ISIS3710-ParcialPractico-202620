"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPlan } from "@/services/plans";
import { getSession } from "@/services/session";

export default function CreatePlanPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const description = String(form.get("description"));
    const price = Number(form.get("price"));
    const time = Number(form.get("time"));

    if (name.length < 2 || name.length > 50) {
      setError("El nombre debe tener entre 2 y 50 caracteres");
      return;
    }

    if (price <= 0) {
      setError("El precio estimado debe ser mayor a 0");
      return;
    }

    if (!Number.isInteger(time)) {
      setError("La duración debe ser un número entero");
      return;
    }

    if (description.length >= 600) {
      setError("La descripción debe tener menos de 600 caracteres");
      return;
    }

    try {
      await createPlan({
        name: name,
        description: description,
        estimatedPrice: price,
        estimatedTime: time,
        recomendations: form.get("recomendations"),
        address: form.get("address"),
        image: form.get("image"),
        userId: getSession().id,
      });

      router.push("/plans");
    } catch (err) {
      setError("No se pudo crear el plan");
      console.log(err);
    }
  }

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900">
          Crear un nuevo plan
        </h1>

        <p className="text-slate-600 mt-2">
          Organiza, invita a tus amigos o abre plazas para que otros miembros se sumen a vivir momentos únicos.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 bg-white border rounded-2xl p-8 mt-6"
        >
          <label htmlFor="image" className="font-semibold">
            Foto de portada del plan
          </label>
          <input
            id="image"
            name="image"
            placeholder="https://..."
            className="bg-slate-50 border-2 border-dashed rounded-lg p-3"
          />

          <label htmlFor="name" className="font-semibold mt-4">
            Nombre del plan <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            placeholder="Ej. Tarde de paddle surf y atardecer"
            required
            className="bg-slate-50 border rounded-lg p-3"
          />

          <label htmlFor="address" className="font-semibold mt-4">
            Dirección <span className="text-red-600">*</span>
          </label>
          <input
            id="address"
            name="address"
            placeholder="Ej. Bahía de las Brisas • Muelle Norte"
            required
            className="bg-slate-50 border rounded-lg p-3"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="font-semibold">
                Precio estimado <span className="text-red-600">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                placeholder="Ej. 25000"
                required
                className="bg-slate-50 border rounded-lg p-3"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="time" className="font-semibold">
                Duración (minutos) <span className="text-red-600">*</span>
              </label>
              <input
                id="time"
                name="time"
                placeholder="Ej. 120"
                required
                className="bg-slate-50 border rounded-lg p-3"
              />
            </div>
          </div>

          <label htmlFor="description" className="font-semibold mt-4">
            Descripción del plan <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Cuéntale a todos de qué va el plan..."
            required
            className="bg-slate-50 border rounded-lg p-3"
          />

          <label htmlFor="recomendations" className="font-semibold mt-4">
            Recomendaciones para los asistentes
          </label>
          <input
            id="recomendations"
            name="recomendations"
            placeholder="Ej. Llevar protector solar, toalla y agua"
            className="bg-slate-50 border rounded-lg p-3"
          />

          {error && (
            <p className="text-red-600 mt-4">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-4 border-t pt-6 mt-6">
            <Link
              href="/plans"
              className="bg-slate-200 font-semibold rounded-lg px-8 py-3"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold rounded-lg px-8 py-3"
            >
              Publicar plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


