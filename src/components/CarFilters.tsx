"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

interface CarFiltersProps {
  brands: string[];
  currentOrigin?: string;
  currentBrand?: string;
  currentQ?: string;
  basePath: string;
}

export function CarFilters({
  brands,
  currentOrigin,
  currentBrand,
  currentQ,
  basePath,
}: CarFiltersProps) {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const origin = form.get("origin") as string;
    const brand = form.get("brand") as string;
    const q = form.get("q") as string;

    if (origin) params.set("origin", origin);
    if (brand) params.set("brand", brand);
    if (q) params.set("q", q);

    router.push(`${basePath}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(basePath);
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-wrap items-end gap-4 p-4">
      <div className="min-w-[140px] flex-1">
        <label className="mb-1 block text-xs text-ink-400">Buscar</label>
        <input
          name="q"
          defaultValue={currentQ || ""}
          className="input-field py-2 text-sm"
          placeholder="Marca, modelo..."
        />
      </div>
      <div className="min-w-[120px]">
        <label className="mb-1 block text-xs text-ink-400">Origen</label>
        <select name="origin" defaultValue={currentOrigin || ""} className="input-field py-2 text-sm">
          <option value="">Todos</option>
          <option value="japanese">Japonés</option>
          <option value="classic">Clásico</option>
        </select>
      </div>
      <div className="min-w-[120px]">
        <label className="mb-1 block text-xs text-ink-400">Marca</label>
        <select name="brand" defaultValue={currentBrand || ""} className="input-field py-2 text-sm">
          <option value="">Todas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary py-2 text-sm">
        Filtrar
      </button>
      {(currentOrigin || currentBrand || currentQ) && (
        <button type="button" onClick={clearFilters} className="btn-secondary py-2 text-sm">
          Limpiar
        </button>
      )}
    </form>
  );
}
