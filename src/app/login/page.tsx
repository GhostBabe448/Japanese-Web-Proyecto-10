import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-50">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-ink-400">
          Accede a tu cuenta para vender y pujar
        </p>
      </div>
      <div className="card p-6">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-center text-sm text-ink-400">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-crimson-light hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
