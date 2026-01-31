# Migración de IDs a UUID - Completada ✅

## Resumen de Cambios

Se migró exitosamente el sistema de identificadores de usuario de `SERIAL` (enteros auto-incrementales) a `UUID` (identificadores únicos universales).

## Cambios en el Schema

### Antes (SERIAL/INTEGER)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- Auto-incremental integer
  ...
);

CREATE TABLE audit_logs (
  user_id INTEGER REFERENCES users(id),
  ...
);

CREATE TABLE password_resets (
  user_id INTEGER NOT NULL REFERENCES users(id),
  ...
);
```

### Después (UUID)
```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- UUID generado automáticamente
  ...
);

CREATE TABLE audit_logs (
  user_id UUID REFERENCES users(id),
  ...
);

CREATE TABLE password_resets (
  user_id UUID NOT NULL REFERENCES users(id),
  ...
);
```

## Cambios en TypeScript

### Tipos Actualizados

**shared/types/auth.d.ts**
```typescript
// Antes
interface User {
  id: number  
  ...
}

// Después
interface User {
  id: string  // UUID como string
  ...
}
```

### Schema Drizzle ORM

**server/db/schema.ts**
```typescript
// Antes
import { integer, pgTable, serial, ... } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  ...
})

export const auditLogs = pgTable('audit_logs', {
  userId: integer('user_id').references(() => users.id),
  ...
})

// Después
import { pgTable, serial, uuid, ... } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  ...
})

export const auditLogs = pgTable('audit_logs', {
  userId: uuid('user_id').references(() => users.id),
  ...
})
```

## Cambios en el Código

### Eliminación de parseInt()

Se eliminaron todas las llamadas a `parseInt()` para user IDs, ya que ahora son strings:

**Archivos modificados:**
- `server/api/admin/users/[id].delete.ts`
- `server/api/admin/users/[id].patch.ts`
- `server/api/github/callback.get.ts` (2 ocurrencias)

```typescript
// Antes
const userId = parseInt(event.context.params!.id)
.where(eq(tables.users.id, parseInt(savedUserId)))

// Después
const userId = event.context.params!.id
.where(eq(tables.users.id, savedUserId))
```

## Migración de Base de Datos

### Script de Migración

**scripts/migrate-to-uuid.js**
- Ejecuta `server/db/migrations/0002_migrate_to_uuid.sql`
- **Advertencia:** Elimina todas las tablas existentes y las recrea
- Crea usuario admin con UUID generado automáticamente

### Ejecución

```bash
node scripts/migrate-to-uuid.js
```

**Resultado:**
```
✅ Migration completed successfully!
✅ Tables recreated with UUID primary keys
✅ Admin user created: elingan@gmail.com / admin123
```

## Beneficios de UUID

### Ventajas

1. **Seguridad:** No se puede predecir el siguiente ID
2. **Escalabilidad:** IDs únicos globalmente, sin conflictos en sistemas distribuidos
3. **Privacidad:** No revelan información sobre cantidad de usuarios
4. **Compatibilidad:** Estándar en sistemas modernos
5. **Merge-friendly:** Múltiples bases de datos se pueden combinar sin conflictos

### Consideraciones

1. **Tamaño:** UUID ocupa 16 bytes vs 4 bytes de INTEGER
2. **Legibilidad:** Menos amigables para debugging (ej: `550e8400-e29b-41d4-a716-446655440000` vs `1`)
3. **Rendimiento:** Ligeramente más lento en índices (diferencia mínima en la práctica)

## Cambios en API Responses

### Antes (INTEGER)
```json
{
  "user": {
    "id": 1,
    "email": "elingan@gmail.com",
    "role": "admin"
  }
}
```

### Después (UUID)
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "elingan@gmail.com",
    "role": "admin"
  }
}
```

## Testing

Para verificar que la migración funcionó correctamente:

```bash
# 1. Iniciar el servidor
pnpm dev

# 2. Login con el usuario admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"elingan@gmail.com","password":"admin123"}'

# 3. Verificar que el ID es un UUID
# Respuesta esperada:
{
  "user": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",  // UUID
    "email": "elingan@gmail.com",
    "role": "admin"
  }
}
```

## Rollback (Si fuera necesario)

Si necesitas volver a IDs enteros:

1. Restaurar archivos anteriores:
   ```bash
   git revert HEAD
   ```

2. Ejecutar migración inversa:
   ```bash
   node scripts/migrate.js  # Usa el script original con SERIAL
   ```

## Archivos Creados

- `server/db/migrations/0002_migrate_to_uuid.sql` - Migración SQL
- `scripts/migrate-to-uuid.js` - Script de migración

## Archivos Modificados

- `server/db/schema.ts` - Schema Drizzle ORM
- `server/db/migrations/0001_create_users_table.sql` - Migración inicial actualizada
- `shared/types/auth.d.ts` - Tipos TypeScript
- `server/api/admin/users/[id].delete.ts` - Endpoint delete usuario
- `server/api/admin/users/[id].patch.ts` - Endpoint update usuario
- `server/api/github/callback.get.ts` - Callback GitHub
- `scripts/migrate.js` - Ruta de archivo corregida

## Estado Actual

✅ **Base de datos migrada exitosamente a UUID**  
✅ **Todos los tipos TypeScript actualizados**  
✅ **Código adaptado para trabajar con strings**  
✅ **Usuario admin recreado con UUID**  
✅ **Tests pasando correctamente**

---

**Fecha de migración:** 31 de enero de 2026  
**Commit:** 2337516  
**Branch:** auth
