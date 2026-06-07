"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface SellFormProps {
  defaultType?: "sale" | "auction";
}

export function SellForm({ defaultType = "sale" }: SellFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listingType, setListingType] = useState<"sale" | "auction">(defaultType);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      brand: form.get("brand"),
      model: form.get("model"),
      year: Number(form.get("year")),
      price: Number(form.get("price")),
      mileage: Number(form.get("mileage")),
      description: form.get("description"),
      imageUrl: form.get("imageUrl"),
      origin: form.get("origin"),
      listingType,
      auctionDays: listingType === "auction" ? Number(form.get("auctionDays") || 7) : undefined,
    };

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al publicar");

      if (listingType === "auction") {
        router.push(`/subastas/${data.id}`);
      } else {
        router.push(`/comprar/${data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setListingType("sale")}
          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${
            listingType === "sale"
              ? "border-crimson bg-crimson/10 text-crimson-light"
              : "border-ink-600 text-ink-400 hover:border-ink-500"
          }`}
        >
          Venta directa
        </button>
        <button
          type="button"
          onClick={() => setListingType("auction")}
          className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${
            listingType === "auction"
              ? "border-crimson bg-crimson/10 text-crimson-light"
              : "border-ink-600 text-ink-400 hover:border-ink-500"
          }`}
        >
          Subasta
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm text-ink-300">Título del anuncio</label>
          <input name="title" required className="input-field" placeholder="Ej: Nissan Skyline GT-R R34 V-Spec" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-300">Marca</label>
          <input name="brand" required className="input-field" placeholder="Nissan" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-300">Modelo</label>
          <input name="model" required className="input-field" placeholder="Skyline GT-R" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-300">Año</label>
          <input name="year" type="number" required min={1950} max={2026} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-300">Kilometraje</label>
          <input name="mileage" type="number" required min={0} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-300">
            {listingType === "auction" ? "Precio inicial (€)" : "Precio (€)"}
          </label>
          <input name="price" type="number" required min={1} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-300">Origen</label>
          <select name="origin" required className="input-field">
            <option value="japanese">Japonés</option>
            <option value="classic">Clásico valorado</option>
          </select>
        </div>
        {listingType === "auction" && (
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Duración (días)</label>
            <input name="auctionDays" type="number" defaultValue={7} min={1} max={30} className="input-field" />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm text-ink-300">URL de imagen</label>
          <input
            name="imageUrl"
            type="url"
            required
            className="input-field"
            placeholder="https://upload.wikimedia.org/..."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm text-ink-300">Descripción</label>
          <textarea
            name="description"
            required
            rows={4}
            className="input-field resize-none"
            placeholder="Describe el estado, modificaciones, historial..."
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson-light">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Publicando..." : listingType === "auction" ? "Iniciar subasta" : "Publicar anuncio"}
      </button>
    </form>
  );
}
