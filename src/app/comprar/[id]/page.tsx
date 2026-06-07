import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatMileage, originLabel } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id },
    include: { seller: { select: { name: true } } },
  });

  if (!car || car.listingType !== "sale") notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/comprar" className="mb-6 inline-block text-sm text-ink-400 hover:text-crimson-light">
        ← Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <Image
            src={car.imageUrl}
            alt={car.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <div className="mb-2 flex gap-2">
            <span className="rounded-md bg-ink-800 px-2 py-1 text-xs text-gold">
              {originLabel(car.origin)}
            </span>
            <span className="rounded-md bg-ink-800 px-2 py-1 text-xs text-ink-300">
              {car.year}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-50 md:text-4xl">
            {car.title}
          </h1>
          <p className="mt-1 text-ink-400">
            {car.brand} {car.model} · {formatMileage(car.mileage)}
          </p>

          <div className="card mt-6 p-6">
            <p className="text-sm text-ink-400">Precio</p>
            <p className="text-3xl font-bold text-ink-50">{formatPrice(car.price)}</p>
            <button className="btn-primary mt-4 w-full">
              Contactar vendedor
            </button>
            <p className="mt-3 text-center text-xs text-ink-500">
              Vendedor: {car.seller.name}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink-50">
              Descripción
            </h2>
            <p className="leading-relaxed text-ink-300">{car.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
