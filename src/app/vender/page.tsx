import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SellForm } from "@/components/SellForm";

export default async function VenderPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/vender");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="section-title">Vender</h1>
        <p className="mt-2 text-ink-400">
          Publica tu coche en venta directa o ponlo en subasta
        </p>
      </div>
      <SellForm />
    </div>
  );
}
