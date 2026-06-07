import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const noto = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "和Auto — Coches japoneses y clásicos",
  description:
    "Compra, vende y puja por coches de origen japonés y clásicos valorados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${noto.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-5rem)]">{children}</main>
          <footer className="border-t border-ink-800 bg-ink-950 py-8">
            <div className="mx-auto max-w-7xl px-4 text-center text-sm text-ink-500 sm:px-6">
              <p className="font-display text-ink-400">
                和Auto — Pasión por la ingeniería japonesa
              </p>
              <p className="mt-1">© {new Date().getFullYear()} Todos los derechos reservados</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
