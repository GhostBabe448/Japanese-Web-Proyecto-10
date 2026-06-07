"use client";

import { FormEvent, useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al registrarse");

        const { signIn } = await import("next-auth/react");
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) throw new Error(result.error);
        window.location.href = "/";
        return;
      }

      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) throw new Error("Credenciales incorrectas");
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-300">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Tu nombre"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-300">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson-light">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading
          ? "Procesando..."
          : mode === "login"
            ? "Iniciar sesión"
            : "Crear cuenta"}
      </button>
    </form>
  );
}
