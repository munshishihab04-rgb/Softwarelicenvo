# SoftKeys Store

A full e-commerce marketplace for digital software license keys and subscriptions (Microsoft, Autodesk, Adobe, Windows, Antivirus, Games, VPN).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/softkeys-store run dev` — run the frontend store (proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS (dark theme, electric blue accents)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — DB schema (categories, products, orders tables)
- `artifacts/api-server/src/routes/` — Express route handlers (categories, products, orders)
- `artifacts/softkeys-store/src/` — React frontend store
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — Generated Zod validators (do not edit)

## Architecture decisions

- Cart is managed client-side via React Context + localStorage (no backend cart endpoint needed).
- All products seeded directly via executeSql with numeric pricing stored as NUMERIC in DB, parsed back to floats in routes.
- License keys are auto-generated on order creation (random 5-5-5-5 alphanumeric format).
- Coupon code `SAVE10` applies a 10% discount at checkout.
- Products route guards against null/undefined/NaN query params from the frontend.

## Product

- Homepage: hero banner, featured products, categories grid, deals, store stats, trust badges
- Products catalog: category filter sidebar, search, type filter (keys vs subscriptions), sale filter
- Product detail: full product info, rating, platform, subscription duration, add to cart, related products
- Cart: cart drawer (slides from right) + full cart page with quantity controls
- Checkout: customer info form, payment method selector (card/paypal/crypto), order summary
- Order confirmation: success page showing delivered license keys

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always guard query params against "null"/"undefined" strings before using in DB queries.
- After OpenAPI spec changes, run `pnpm --filter @workspace/api-spec run codegen` before touching routes or frontend hooks.
- The `and()` condition in Drizzle requires at least 1 condition — always check `conditions.length > 0`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
