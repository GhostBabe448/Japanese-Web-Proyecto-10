import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatMileage, originLabel, timeRemaining } from "@/lib/utils";

interface CarCardProps {
  car: {
    id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    imageUrl: string;
    origin: string;
    listingType: string;
    auctionEnd?: Date | null;
    status: string;
    _count?: { bids: number };
  };
}

export function CarCard({ car }: CarCardProps) {
  const href =
    car.listingType === "auction"
      ? `/subastas/${car.id}`
      : `/comprar/${car.id}`;

  const isAuction = car.listingType === "auction";
  const auctionActive =
    isAuction && car.auctionEnd && car.auctionEnd.getTime() > Date.now();

  return (
    <Link href={href} className="card group overflow-hidden transition hover:border-ink-500">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={car.imageUrl}
          alt={car.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-md bg-ink-950/80 px-2 py-1 text-xs font-medium text-ink-100 backdrop-blur">
            {originLabel(car.origin)}
          </span>
          {isAuction && (
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium backdrop-blur ${
                auctionActive
                  ? "bg-crimson/90 text-white"
                  : "bg-ink-700/90 text-ink-300"
              }`}
            >
              {auctionActive ? "En subasta" : "Finalizada"}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-gold">
            {car.brand}
          </span>
          <span className="text-xs text-ink-400">{car.year}</span>
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold text-ink-50 group-hover:text-crimson-light">
          {car.title}
        </h3>
        <p className="mb-3 text-sm text-ink-400">{formatMileage(car.mileage)}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-ink-500">
              {isAuction ? "Puja actual" : "Precio"}
            </p>
            <p className="text-xl font-bold text-ink-50">
              {formatPrice(car.price)}
            </p>
          </div>
          {isAuction && car.auctionEnd && auctionActive && (
            <div className="text-right">
              <p className="text-xs text-ink-500">Termina en</p>
              <p className="text-sm font-medium text-crimson-light">
                {timeRemaining(car.auctionEnd)}
              </p>
            </div>
          )}
          {isAuction && car._count && (
            <p className="text-xs text-ink-500">{car._count.bids} pujas</p>
          )}
        </div>
      </div>
    </Link>
  );
}
