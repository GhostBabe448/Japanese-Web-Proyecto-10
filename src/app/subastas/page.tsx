import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";

interface PageProps {
  searchParams: Promise<{ origin?: string; brand?: string; q?: string }>;
}

export default async function SubastasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where: Record<string, unknown> = {
    listingType: "auction",
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
    orderBy: { auctionEnd: "asc" },
    include: { _count: { select: { bids: true } } },
  });

  const brands = await prisma.car.findMany({
    where: { listingType: "auction" },
    select: { brand: true },
    distinct: ["brand"],
  });

  const active = cars.filter(
    (c) => c.auctionEnd && c.auctionEnd.getTime() > Date.now() && c.status === "active"
  );
  const ended = cars.filter(
    (c) => !c.auctionEnd || c.auctionEnd.getTime() <= Date.now() || c.status !== "active"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="section-title">Subastas</h1>
        <p className="mt-2 text-ink-400">
          El que más puja se lo queda — compite por piezas únicas
        </p>
      </div>

      <Suspense fallback={<div className="card h-16 animate-pulse" />}>
        <CarFilters
          brands={brands.map((b) => b.brand)}
          currentOrigin={params.origin}
          currentBrand={params.brand}
          currentQ={params.q}
          basePath="/subastas"
        />
      </Suspense>

      {active.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-crimson-light">
            Activas ({active.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      {ended.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-ink-400">
            Finalizadas ({ended.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ended.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      {cars.length === 0 && (
        <div className="card mt-8 p-12 text-center">
          <p className="text-ink-400">No hay subastas disponibles.</p>
        </div>
      )}
    </div>
  );
}
