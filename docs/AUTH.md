# Authentication System

## Quick Start

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"elingan@gmail.com","password":"admin123"}'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

### Check Session
```bash
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

## User Management (Admin Only)

### List Users
```bash
curl http://localhost:3000/api/admin/users \
  -b cookies.txt
```

### Create User
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "email":"user@example.com",
    "password":"password123",
    "name":"John Doe",
    "role":"editor"
  }'
```

### Update User
```bash
curl -X PATCH http://localhost:3000/api/admin/users/2 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name":"Jane Doe",
    "role":"owner"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/admin/users/2 \
  -b cookies.txt
```

## Password Recovery

### Request Reset
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"TOKEN_FROM_EMAIL",
    "password":"newpassword123"
  }'
```

## Composables

### useUserSession (Client & Server)
```vue
<script setup>
const { loggedIn, user, clear, fetch } = useUserSession()

// user.value = { id, email, name, role, githubData }
// loggedIn.value = true/false
</script>
```

### useRole (Client)
```vue
<script setup>
const { role, isAdmin, isOwner, isEditor } = useRole()

// role.value = 'admin' | 'owner' | 'editor'
// isAdmin.value = true/false
</script>
```

### requireUserSession (Server)
```typescript
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  // session.user = { id, email, name, role, githubData }
  
  // Throws 401 if not authenticated
})
```

## Middleware

### auth.global.ts
Protects routes requiring authentication:
- `/dashboard`, `/billing`, `/notifications`, `/settings`, `/site`, `/profile`, `/admin`

Redirects unauthenticated users to `/login`

### admin.global.ts
Protects `/admin/*` routes, ensuring only admin users can access.

## Database Schema

### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,  -- bcrypt hashed
  name TEXT,
  role user_role NOT NULL DEFAULT 'editor',  -- 'admin' | 'owner' | 'editor'
  github_data JSONB,  -- { installationId, accountType, ... }
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,  -- 'login', 'logout', 'user_created', etc.
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### password_resets
```sql
CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,  -- 1 hour from creation
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Utilities

### Password Hashing
```typescript
import { hashPassword, verifyPassword } from '~/server/utils/password'

const hashedPassword = await hashPassword('plaintext')
const isValid = await verifyPassword('plaintext', hashedPassword)
```

### Audit Logging
```typescript
import { createAuditLog } from '~/server/utils/audit'

await createAuditLog(
  userId,           // number | null
  'action_name',    // string
  { key: 'value' }, // optional details
  event             // optional H3Event for IP/UA
)
```

## Session Management

Sessions are stored in encrypted cookies via `nuxt-auth-utils`.

### Configuration
- **Cookie name**: `nuxt-session`
- **Encryption**: Sealed with `NUXT_SESSION_PASSWORD`
- **Max age**: 7 days
- **Size limit**: 4KB (stores minimal data)
- **HttpOnly**: Yes
- **Secure**: Yes (production)
- **SameSite**: Lax

### What's Stored
```typescript
{
  user: {
    id: number,
    email: string,
    name: string | null,
    role: 'admin' | 'owner' | 'editor',
    githubData?: { ... }
  },
  loggedInAt: Date
}
```

## Security Features

### Password Policy
- Minimum 6 characters (enforced by zod)
- Hashed with bcrypt (10 rounds)
- Never logged or transmitted in plain text

### Rate Limiting
⚠️ **Not implemented yet** - recommended for production:
- Login: 5 attempts per 15 minutes
- Password reset: 3 requests per hour
- API endpoints: 100 requests per minute

### CSRF Protection
- State parameter for OAuth flows
- Encrypted cookies prevent tampering
- HttpOnly cookies prevent XSS

### Audit Trail
All security-relevant actions are logged:
- Authentication events (login, logout)
- User management (create, update, delete)
- Password changes

## Environment Variables

Required:
```env
DATABASE_URL=postgresql://user:pass@host/db
NUXT_SESSION_PASSWORD=<32-byte-base64-string>
```

Optional:
```env
GITHUB_APP_ID=...
GITHUB_PRIVATE_KEY=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Troubleshooting

### Session not persisting
- Check `NUXT_SESSION_PASSWORD` is set
- Verify cookies are enabled in browser
- Check cookie domain matches your origin

### "Unauthorized" errors
- Verify you're logged in
- Check session hasn't expired (7 days)
- Try logging out and back in

### GitHub integration not working
- Verify GitHub App is installed
- Check `github_data` column in users table
- Ensure installation ID is correct

### Password reset not sending emails
- Currently logged to console only
- Implement email service in `forgot-password.post.ts`

## Future Enhancements

- [ ] Email service integration (Resend, Nodemailer)
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting middleware
- [ ] Password complexity requirements
- [ ] Account lockout after failed attempts
- [ ] Social OAuth providers (GitHub, Google, etc.)
- [ ] Remember me functionality
- [ ] Session device management
- [ ] Email verification
- [ ] Password expiration policy
