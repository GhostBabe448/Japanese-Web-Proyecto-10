import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMileage(km: number): string {
  return new Intl.NumberFormat("es-ES").format(km) + " km";
}

export function originLabel(origin: string): string {
  return origin === "japanese" ? "Japonés" : "Clásico valorado";
}

export function timeRemaining(endDate: Date): string {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return "Finalizada";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function isAuctionActive(endDate: Date | null): boolean {
  if (!endDate) return false;
  return endDate.getTime() > Date.now();
}
