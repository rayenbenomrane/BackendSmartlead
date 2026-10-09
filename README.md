# Smart Lead Management — Auth scaffold

## Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env      # then edit DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run start:dev         # runs on http://localhost:3001
```

Endpoints:
- `POST /auth/register` → { name, email, password } → { accessToken, user }
- `POST /auth/login` → { email, password } → { accessToken, user }
- `GET /users/me` → requires `Authorization: Bearer <token>`

To protect a route by role later:
```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin-only')
```

## Frontend (Next.js — App Router)

```bash
cd frontend
# create the app if you haven't yet: npx create-next-app@latest . --typescript --app
npm install
echo "API_URL=http://localhost:3001" > .env.local
npm run dev                # runs on http://localhost:3000
```

The frontend never talks to the NestJS API directly for auth — it goes through
`/api/auth/login` and `/api/auth/register` (Next.js route handlers), which set
the JWT as an **httpOnly cookie**. This keeps the token out of reach of
client-side JS (safer against XSS than storing it in localStorage).

`middleware.ts` blocks any page other than `/login` and `/register` if the
`token` cookie is missing, and redirects logged-in users away from those two
pages.

## What's intentionally left out (next steps)
- Password reset / email verification.
- `RolesGuard` is wired but not yet applied to any route — add it once you
  have routes that should be Admin-only.
- Company/multi-tenant scoping (add `companyId` to `User` and every future
  model once you get to that module).
- Refresh tokens — current setup uses a single 7-day access token, fine for
  a stage project, not for production.
"# BackendSmartlead" 
