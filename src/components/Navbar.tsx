"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navLinks = [
  { href: "/comprar", label: "Comprar" },
  { href: "/vender", label: "Vender" },
  { href: "/subastas", label: "Subastas" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-display text-xl font-bold text-ink-50">
            和<span className="text-crimson">Auto</span>
          </span>
          <span className="hidden text-xs text-ink-400 sm:inline">
            Coches japoneses & clásicos
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-ink-800 text-crimson-light"
                  : "text-ink-300 hover:bg-ink-800 hover:text-ink-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-ink-800" />
          ) : session ? (
            <>
              <span className="hidden text-sm text-ink-400 sm:inline">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-secondary py-2 text-xs"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary py-2 text-xs">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary py-2 text-xs">
                Registro
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="flex gap-1 overflow-x-auto border-t border-ink-800 px-4 py-2 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
              pathname.startsWith(link.href)
                ? "bg-ink-800 text-crimson-light"
                : "text-ink-400"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
