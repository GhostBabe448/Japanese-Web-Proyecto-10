import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatMileage,
  originLabel,
  timeRemaining,
  isAuctionActive,
} from "@/lib/utils";
import { BidForm } from "@/components/BidForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      seller: { select: { name: true } },
      bids: {
        orderBy: { amount: "desc" },
        include: { bidder: { select: { name: true } } },
        take: 10,
      },
    },
  });

  if (!car || car.listingType !== "auction") notFound();

  const active = isAuctionActive(car.auctionEnd);
  const highestBid = car.bids[0];
  const minBid = Math.ceil(car.price + 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/subastas" className="mb-6 inline-block text-sm text-ink-400 hover:text-crimson-light">
        ← Volver a subastas
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
            <Image
              src={car.imageUrl}
              alt={car.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {active && (
              <div className="absolute right-4 top-4 rounded-lg bg-crimson px-3 py-1.5 text-sm font-semibold text-white">
                Termina en {car.auctionEnd && timeRemaining(car.auctionEnd)}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex gap-2">
              <span className="rounded-md bg-ink-800 px-2 py-1 text-xs text-gold">
                {originLabel(car.origin)}
              </span>
              <span className="rounded-md bg-ink-800 px-2 py-1 text-xs text-ink-300">
                {car.year}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-ink-50">
              {car.title}
            </h1>
            <p className="mt-1 text-ink-400">
              {car.brand} {car.model} · {formatMileage(car.mileage)}
            </p>
            <p className="mt-4 leading-relaxed text-ink-300">{car.description}</p>
            <p className="mt-4 text-sm text-ink-500">Vendedor: {car.seller.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <p className="text-sm text-ink-400">
              {highestBid ? "Puja más alta" : "Precio inicial"}
            </p>
            <p className="text-3xl font-bold text-crimson-light">
              {formatPrice(highestBid?.amount ?? car.price)}
            </p>
            {highestBid && (
              <p className="mt-1 text-xs text-ink-500">
                por {highestBid.bidder.name}
              </p>
            )}
          </div>

          {session ? (
            <BidForm
              carId={car.id}
              currentPrice={highestBid?.amount ?? car.price}
              minBid={minBid}
              active={active}
            />
          ) : (
            <div className="card p-6 text-center">
              <p className="text-ink-400">Inicia sesión para pujar</p>
              <Link href="/login" className="btn-primary mt-4 inline-flex">
                Iniciar sesión
              </Link>
            </div>
          )}

          <div className="card p-6">
            <h3 className="mb-4 font-semibold text-ink-50">
              Historial de pujas ({car.bids.length})
            </h3>
            {car.bids.length === 0 ? (
              <p className="text-sm text-ink-500">Aún no hay pujas</p>
            ) : (
              <ul className="space-y-3">
                {car.bids.map((bid, i) => (
                  <li
                    key={bid.id}
                    className={`flex items-center justify-between text-sm ${
                      i === 0 ? "font-semibold text-crimson-light" : "text-ink-400"
                    }`}
                  >
                    <span>{bid.bidder.name}</span>
                    <span>{formatPrice(bid.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
