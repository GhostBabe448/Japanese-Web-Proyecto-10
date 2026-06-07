import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";

interface PageProps {
  searchParams: Promise<{ origin?: string; brand?: string; q?: string }>;
}

export default async function ComprarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where: Record<string, unknown> = {
    listingType: "sale",
    status: "active",
  };

  if (params.origin) where.origin = params.origin;
  if (params.brand) where.brand = { contains: params.brand };
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { brand: { contains: params.q } },
      { model: { contains: params.q } },
    ];
  }

  const cars = await prisma.car.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const brands = await prisma.car.findMany({
    where: { listingType: "sale", status: "active" },
    select: { brand: true },
    distinct: ["brand"],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="section-title">Comprar</h1>
        <p className="mt-2 text-ink-400">
          Coches japoneses y clásicos valorados en venta directa
        </p>
      </div>

      <Suspense fallback={<div className="card h-16 animate-pulse" />}>
        <CarFilters
          brands={brands.map((b) => b.brand)}
          currentOrigin={params.origin}
          currentBrand={params.brand}
          currentQ={params.q}
          basePath="/comprar"
        />
      </Suspense>

      {cars.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <p className="text-ink-400">No se encontraron coches con esos filtros.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
