import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-50">Crear cuenta</h1>
        <p className="mt-2 text-sm text-ink-400">
          Únete a la comunidad de entusiastas
        </p>
      </div>
      <div className="card p-6">
        <AuthForm mode="register" />
      </div>
      <p className="mt-6 text-center text-sm text-ink-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-crimson-light hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
