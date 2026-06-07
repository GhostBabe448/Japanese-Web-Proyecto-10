# 和Auto — Coches Japoneses & Clásicos

Plataforma completa para **comprar**, **vender** y **pujar** por coches de origen japonés y clásicos valorados.

## Funcionalidades

- **Comprar** — Catálogo con filtros por origen, marca y búsqueda
- **Vender** — Publicar anuncios en venta directa o subasta
- **Subastas** — Sistema de pujas en tiempo real (el mayor postor gana)
- **Login/Register** — Autenticación con NextAuth (funciona en local y producción)
- **UI limpia** — Diseño oscuro con estética japonesa

## Inicio rápido (local)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env si es necesario

# 3. Crear base de datos y datos de ejemplo
npm run db:setup

# 4. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Cuentas de prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| demo@waauto.com | demo123 | Comprador |
| vendedor@waauto.com | demo123 | Vendedor |

---

## Despliegue gratuito en la web

> **Importante:** SQLite solo funciona en local. Para producción necesitas PostgreSQL gratuito (Neon, Supabase o Vercel Postgres).

### Opción A — Vercel (recomendada)

1. **Sube el código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/waauto.git
   git push -u origin main
   ```

2. **Crea base de datos PostgreSQL gratuita en [Neon](https://neon.tech)**
   - Regístrate → New Project → copia la connection string
   - Ejemplo: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

3. **Cambia el provider de Prisma a PostgreSQL**
   
   En `prisma/schema.prisma`, cambia:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Despliega en [Vercel](https://vercel.com)**
   - Import Project → selecciona tu repo de GitHub
   - Añade variables de entorno:
     | Variable | Valor |
     |----------|-------|
     | `DATABASE_URL` | Tu connection string de Neon |
     | `NEXTAUTH_SECRET` | Genera con: `openssl rand -base64 32` |
     | `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` |
   - Deploy

5. **Ejecuta migraciones y seed en producción**
   ```bash
   # Desde tu máquina local con DATABASE_URL de producción:
   DATABASE_URL="postgresql://..." npx prisma db push
   DATABASE_URL="postgresql://..." npm run db:seed
   ```

### Opción B — Render

1. Sube a GitHub (igual que arriba)
2. En [Render](https://render.com) → New → Web Service → conecta tu repo
3. Configura:
   - **Build Command:** `npm install && npx prisma db push && npm run build`
   - **Start Command:** `npm start`
4. Añade PostgreSQL gratuito en Render (New → PostgreSQL)
5. Variables de entorno: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
6. Ejecuta seed: `DATABASE_URL="..." npm run db:seed`

### Opción C — Railway

1. [Railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Añade plugin PostgreSQL
3. Variables: `DATABASE_URL` (auto), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
4. Build: `npm run build` | Start: `npm start`

### Opción D — Netlify

Netlify soporta Next.js con el adaptador. Sigue pasos similares a Vercel usando Neon para la base de datos.

---

## Variables de entorno

| Variable | Descripción | Local | Producción |
|----------|-------------|-------|------------|
| `DATABASE_URL` | URL de base de datos | `file:./dev.db` | PostgreSQL URL |
| `NEXTAUTH_SECRET` | Secreto para JWT | Cualquier string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de la app | `http://localhost:3000` | `https://tu-dominio.com` |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Inicio
│   ├── comprar/              # Catálogo de venta
│   ├── vender/               # Publicar anuncio
│   ├── subastas/             # Subastas y pujas
│   ├── login/ & register/    # Autenticación
│   └── api/                  # API REST
├── components/               # UI reutilizable
└── lib/                      # Auth, Prisma, utilidades
prisma/
├── schema.prisma             # Modelo de datos
└── seed.ts                   # Datos de ejemplo
```

## Stack tecnológico

- **Next.js 15** — Framework React full-stack
- **Prisma** — ORM (SQLite local / PostgreSQL producción)
- **NextAuth.js** — Autenticación con credenciales
- **Tailwind CSS** — Estilos
- **TypeScript** — Tipado estático

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run db:setup` | Crear DB + seed |
| `npm run db:push` | Sincronizar schema |
| `npm run db:seed` | Insertar datos demo |
