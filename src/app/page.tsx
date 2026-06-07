import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CarCard } from "@/components/CarCard";

export const dynamic = "force-dynamic";

async function getFeaturedCars() {
  return prisma.car.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 9,
    include: { _count: { select: { bids: true } } },
  });
}

async function getStats() {
  const [totalCars, totalAuctions, totalBids] = await Promise.all([
    prisma.car.count({ where: { listingType: "sale", status: "active" } }),
    prisma.car.count({ where: { listingType: "auction", status: "active" } }),
    prisma.bid.count(),
  ]);
  return { totalCars, totalAuctions, totalBids };
}

export default async function HomePage() {
  const [cars, stats] = await Promise.all([getFeaturedCars(), getStats()]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-800">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson/10 via-transparent to-gold/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
              和 — Armonía en movimiento
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink-50 md:text-6xl">
              Coches japoneses &{" "}
              <span className="text-crimson">clásicos valorados</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-300">
              Compra, vende o puja por los iconos de la ingeniería automotriz.
              Desde un Skyline GT-R hasta un Porsche 911 clásico.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/comprar" className="btn-primary">
                Explorar coches
              </Link>
              <Link href="/subastas" className="btn-secondary">
                Ver subastas
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { label: "En venta", value: stats.totalCars },
              { label: "Subastas activas", value: stats.totalAuctions },
              { label: "Pujas realizadas", value: stats.totalBids },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 text-center sm:p-6">
                <p className="text-2xl font-bold text-crimson-light sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-ink-400 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="section-title">Destacados</h2>
            <p className="mt-2 text-ink-400">
              Lo mejor de nuestro catálogo japonés y clásico
            </p>
          </div>
          <Link href="/comprar" className="hidden text-sm text-crimson-light hover:underline sm:block">
            Ver todos →
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-400">Aún no hay coches publicados.</p>
            <Link href="/vender" className="btn-primary mt-4 inline-flex">
              Sé el primero en vender
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-ink-800 bg-ink-900/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Comprar",
                desc: "Encuentra tu próximo coche japonés o clásico con filtros por marca, año y origen.",
                href: "/comprar",
                icon: "🚗",
              },
              {
                title: "Vender",
                desc: "Publica tu coche en venta directa o inicia una subasta. Tú decides el precio.",
                href: "/vender",
                icon: "📋",
              },
              {
                title: "Subastas",
                desc: "El que más puja se lo queda. Compite en tiempo real por piezas únicas.",
                href: "/subastas",
                icon: "🔨",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card group p-6 transition hover:border-crimson/50"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink-50 group-hover:text-crimson-light">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
