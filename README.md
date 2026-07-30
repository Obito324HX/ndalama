# Ndalama (v1)

Mobile money reconciliation for small Zambian traders. Manual-entry web app —
no SMS auto-parsing, no ZRA integration in v1.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Neon connection string, then create the schema:

```bash
psql "$DATABASE_URL" -f schema.sql
```

Insert a demo user to develop against (real auth comes later):

```bash
psql "$DATABASE_URL" -c "insert into users (email, password_hash, business_name) values ('you@example.com', 'placeholder', 'Test Shop') returning id;"
```

Copy the returned `id` into `.env.local` as `DEMO_USER_ID`.

```bash
npm run dev
```

Visit http://localhost:3000 — you'll see an empty dashboard. Add a transaction
by POSTing to `/api/transactions`:

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"sale","channel":"mobile_money","amount":350,"category":"sale","counterparty_name":"Chanda M."}'
```

Refresh the dashboard to see it appear.

## What's built so far

- `schema.sql` — full v1 database schema (users, transactions)
- `lib/db.ts` — Neon serverless connection
- `lib/types.ts` — shared TypeScript types
- `lib/auth.ts` — **stub only**, hardcoded demo user, needs real auth
- `app/api/transactions/route.ts` — list + create transactions
- `app/api/transactions/[id]/route.ts` — mark a credit entry as paid
- `app/page.tsx` — dashboard showing today's net, in/out, and entries

## Not built yet

- Real authentication (sign up / log in)
- The "add transaction" form UI (API route exists, no page yet)
- Credit tracker page UI (API route exists, no page yet)
- Deployment config for Vercel
