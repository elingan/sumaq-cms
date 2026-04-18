# Sumaq CMS

Sumaq CMS es un panel administrativo construido con Nuxt 4 para gestionar acceso de usuarios, autenticación, conexión con GitHub App y una base inicial para administración de sitios. El proyecto combina una interfaz web en Nuxt UI con endpoints server-side en Nitro, persistencia con Drizzle ORM y soporte de Nuxthub para base de datos y blob storage.

## Qué hace el proyecto

Actualmente el repositorio cubre estas capacidades:

- autenticación con sesión persistente y recuperación de contraseña
- control de acceso por roles para rutas protegidas y secciones administrativas
- administración de usuarios desde API para altas, edición, listado y eliminación
- integración con GitHub App para conectar una instalación y consultar repositorios autorizados
- internacionalización en español, inglés y alemán
- chequeos de salud para base de datos y almacenamiento blob
- estructura inicial para flujos de sitio como onboarding, storage y summary

## Estado actual

El proyecto ya tiene implementadas las bases de autenticación, roles, administración y GitHub. Algunas pantallas del módulo de sitios todavía funcionan como scaffolding y están preparadas para crecer sobre la estructura ya creada.

## Stack técnico

- Nuxt 4
- Nuxt UI 4
- TypeScript
- Tailwind CSS 4
- Nitro server routes
- Drizzle ORM
- Nuxthub Core
- PostgreSQL en producción con Neon HTTP
- PGlite en desarrollo cuando no existe `DATABASE_URL`
- Blob storage local en desarrollo y Vercel Blob en producción
- Vitest y Playwright para pruebas

## Funcionalidad principal

### Autenticación y sesiones

- login y logout vía `/api/auth/*`
- endpoint `/api/auth/me` para recuperar la sesión actual
- recuperación y reseteo de contraseña
- sesiones cifradas mediante `nuxt-auth-utils`

### Roles y permisos

- middleware global para proteger rutas privadas
- middleware adicional para restringir `/admin` a usuarios con rol `admin`
- modelo de usuarios con roles almacenado en base de datos

### Administración de usuarios

- listado de usuarios desde `/api/admin/users`
- creación de usuarios con contraseña hasheada
- actualización y eliminación de usuarios por ID
- registro de auditoría para acciones sensibles

### Integración con GitHub

- flujo OAuth e instalación de GitHub App
- almacenamiento de la instalación asociada al usuario
- consulta de repositorios accesibles desde `/api/github/repos`
- estado de conexión y desconexión desde la sección administrativa

### Sitios y contenidos

- módulo `site` preparado dentro del panel principal
- vistas base para onboarding, storage y summary
- estructura lista para extender el CMS con flujos de gestión por sitio

## Estructura resumida

```text
app/
  pages/            interfaz, layouts y middleware del panel
  components/       componentes reutilizables de UI
server/
  api/              endpoints de autenticación, admin, GitHub y health checks
  db/               schema y migraciones SQL
  utils/            utilidades de auditoría, cifrado y OAuth
shared/
  types/            tipos compartidos entre cliente y servidor
docs/
  AUTH.md           detalle del sistema de autenticación
  UUID_MIGRATION.md documentación de migración a UUID
```

## Requisitos

- Node.js 20 o superior
- pnpm 10

## Variables de entorno

Crea un archivo `.env` con las variables necesarias para tu entorno.

### Obligatorias

```bash
NUXT_SESSION_PASSWORD=
GITHUB_TOKEN_ENCRYPTION_KEY=
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Según entorno

```bash
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
```

Notas:

- `NUXT_SESSION_PASSWORD` se usa para sellar la sesión.
- `GITHUB_TOKEN_ENCRYPTION_KEY` debe ser una clave hex válida para AES-256-GCM.
- si no defines `DATABASE_URL` en desarrollo, el proyecto usa PGlite.
- si no defines `BLOB_READ_WRITE_TOKEN` en desarrollo, el almacenamiento blob usa filesystem local.

## Instalación

```bash
pnpm install
```

## Desarrollo local

Inicia el servidor en `http://localhost:3000`:

```bash
pnpm dev
```

## Scripts disponibles

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:unit
pnpm test:nuxt
pnpm test:e2e
pnpm test:e2e:ui
pnpm clean
```

## Endpoints relevantes

### Autenticación

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Administración

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

### GitHub

- `GET /api/github/status`
- `GET /api/github/connect`
- `GET /api/github/callback`
- `POST /api/github/disconnect`
- `GET /api/github/repos`

### Health checks

- `GET /api/health/db`
- `GET /api/health/blob`

## Internacionalización

La aplicación está configurada con `@nuxtjs/i18n` y actualmente soporta:

- español
- inglés
- alemán

La estrategia configurada es `no_prefix`, con detección de idioma del navegador y persistencia en cookie.

## Documentación adicional

- `docs/AUTH.md`: detalles del sistema de autenticación y ejemplos de uso
- `docs/UUID_MIGRATION.md`: contexto sobre la migración de IDs a UUID
- `MIGRATION.md`: notas generales de migración del proyecto

## Verificación rápida

Después de levantar el proyecto, estas comprobaciones suelen ser suficientes para validar el entorno:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
```

## Próximos puntos naturales de evolución

- completar el módulo de sitios con persistencia y flujos de negocio
- ampliar el panel con gestión real de contenidos y archivos
- endurecer observabilidad y validaciones alrededor de GitHub App y almacenamiento
