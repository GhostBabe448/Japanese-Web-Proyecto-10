"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface BidFormProps {
  carId: string;
  currentPrice: number;
  minBid: number;
  active: boolean;
}

export function BidForm({ carId, currentPrice, minBid, active }: BidFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(minBid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al pujar");

      setSuccess(`¡Puja de ${formatPrice(amount)} registrada!`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  if (!active) {
    return (
      <div className="card p-6 text-center">
        <p className="text-lg font-semibold text-ink-300">Subasta finalizada</p>
        <p className="mt-1 text-sm text-ink-500">
          Puja ganadora: {formatPrice(currentPrice)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-50">Hacer una puja</h3>
        <p className="text-sm text-ink-400">
          Puja mínima: {formatPrice(minBid)}
        </p>
      </div>

      <div>
        <label htmlFor="amount" className="mb-1.5 block text-sm text-ink-300">
          Tu puja (€)
        </label>
        <input
          id="amount"
          type="number"
          required
          min={minBid}
          step={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input-field text-lg font-semibold"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson-light">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Pujando..." : `Pujar ${formatPrice(amount)}`}
      </button>
    </form>
  );
}
