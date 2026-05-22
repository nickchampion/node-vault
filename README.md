# NodeVault

An NX monorepo containing two frontend applications, a shared REST API, and a set of platform components.

**NodeVault** (`nodevault.cloud`) — a privacy information portal covering three practical paths to reducing your digital footprint: de-Googling your phone with GrapheneOS, replacing cloud subscriptions with a self-hosted UmbrelOS home server, and protecting your home network from IoT surveillance.

**Nick Champion** (`nickchampion.me`) — a personal profile and CV site showcasing engineering background, technical expertise, and project work.

---

## Apps

### `apps/api` — REST API

Node.js API server built on Koa with OpenAPI v3 validation via `openapi-backend`. Runs locally with `tsx watch` and deploys to [Fly.io](https://fly.io) as a Docker container (`nodevault-api`, `lhr` region).

**Stack:** Node.js · Koa · openapi-backend · RavenDB · TypeScript

**Dev server:** `pnpm run api` → `http://api.nodevault.local:9002`

#### Auth flow

Magic-link, no passwords:

1. `POST /auth/login` — looks up user by email, generates an encrypted token stored as a `LoginToken` document (10-minute TTL via RavenDB `@expires`), fetches the rendered login email from the Nuxt app, and sends it via Resend.
2. User clicks the link → `POST /auth/verify` — decrypts the code, validates the `LoginToken`, marks it used, and returns a signed JWT + user/account payload.

#### Handler pattern

```typescript
export const authLogin: ApiHandler = async (context): Promise<Response> => {
  const { email } = context.event.payload as LoginRequestSchema
  // ...
  return context.event.response.ok()
}
```

Handlers are registered by name in `apps/api/handlers/index.ts` — the key **must exactly match the `operationId`** in the OpenAPI schema. The middy middleware lifecycle auto-commits the RavenDB session after each handler.

#### Request lifecycle

```
Koa → OpenAPI route match + schema validation
  → InboundEvent + Context created (RavenDB Session attached)
  → middy middleware:
      before:  logging, timer
      handler: ApiHandler
      after:   commit session, set response headers
      error:   normalise to StandardResponse
  → Koa response
```

---

### `apps/nodevault` — NodeVault frontend

Nuxt 4 (`compatibilityVersion: 4`) SSR app deployed to Cloudflare Workers via the `cloudflare_module` preset. All pages server-render by default; no prerendering.

**Stack:** Nuxt 4 · Vue 3 · Nuxt UI · Pinia · Tailwind CSS · TypeScript

**Dev server:** `pnpm run app` → `http://www.nodevault.local:9001`

**Deploy:** `pnpm run app:build` → Wrangler → Cloudflare Workers (`nodevault` worker)

#### Content areas

| Section | Path | Description |
|---------|------|-------------|
| Privacy Phones | `/phones` | GrapheneOS — de-Googling your phone, compatible devices, privacy app stack |
| Home Server | `/umbrelos` | UmbrelOS self-hosting — hardware, app directory, replacing cloud subscriptions |
| Privacy Router | `/privacy-router` | DNS blocking, WireGuard VPN, VLAN isolation for home networks |
| Blog | `/blog` | Articles and guides |
| Contact | `/company/contact` | Get in touch form |
| About | `/company/about` | About NodeVault |

#### Layouts

| Layout | Used for |
|--------|---------|
| `default` | All public-facing pages — sticky header, footer |
| `admin` | Admin section — full-width header, left sidebar nav |
| `email` | Email templates — branded email card shell (header + footer), no Nuxt chrome injected into inline styles |

#### Email rendering

Email templates are Nuxt pages under `/emails/*` using the `email` layout. The API calls `renderEmail(appUrl, '/emails/login', params)` which fetches the SSR-rendered HTML and passes it to Resend. Query params supply the template variables (e.g. `name`, `code`).

#### Key composables & stores

| Path | Purpose |
|------|---------|
| `app/stores/auth-store.ts` | Pinia store — JWT tokens, expiry, `apiOptions()` |
| `app/composables/useApiClient.ts` | Returns a typed `NodeVaultApiClient` bound to auth tokens |
| `app/composables/useConfig.ts` | Runtime config access |

---

### `apps/nickchampion` — Personal profile site

Nuxt 4 SSR app deployed to Cloudflare Workers. Light-only UI (sky/slate colour scheme) with forced light mode — dark mode is disabled at the CSS level regardless of system preference.

**Stack:** Nuxt 4 · Vue 3 · Nuxt UI · Tailwind CSS · TypeScript

**Dev server:** `pnpm run nickchampion` → `http://www.nickchampion.local:9003`

**Deploy:** Cloudflare Workers (`nickchampion` worker)

#### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — intro, key strengths, technical expertise, current project, recent roles |
| `/cv` | Full CV — career history, education, notable achievements |
| `/nodevault` | NodeVault project showcase — what it is, tech stack, engineering highlights |
| `/contact` | Contact form — name, email, optional phone, message; posts to `/comms/contact` API endpoint |

#### Notes

- No auth — fully public, no admin section
- Contact form submits to the same `/comms/contact` API endpoint as NodeVault, with `interests: ['other']` injected silently (required by the shared schema)
- Uses `PhoneInput` component copied from NodeVault, backed by `Countries` domain model
- Dark mode disabled: `@variant dark` redefined to `never-dark` in CSS, plus `.dark` CSS variable block overridden to light values in `app/assets/css/main.css`

---

## Components (shared libraries)

| Package alias | Path | Purpose |
|---------------|------|---------|
| `@nodevault/platform.components.api` | `components/api` | Koa server, OpenAPI routing, middy middleware, handler types |
| `@nodevault/platform.components.nodevault.server` | `components/nodevault/server` | Server config, domain models, RavenDB indexes |
| `@nodevault/platform.components.nodevault.client` | `components/nodevault/client` | Client runtime config, `NodeVaultApiClient`, typed request methods |
| `@nodevault/platform.components.nodevault.openapi` | `components/nodevault/openapi` | OpenAPI document composition, models, request/response schemas |
| `@nodevault/platform.components.configuration` | `components/configuration` | Config builder (`build<T>()`) |
| `@nodevault/platform.components.context` | `components/context` | `Context`, `InboundEvent`, `Response`, `Log`, middy wrappers |
| `@nodevault/platform.components.domain` | `components/domain` | Domain models (`User`, `Account`, `LoginToken`, `Contact`), types, geo data |
| `@nodevault/platform.components.ravendb` | `components/ravendb` | `Session` wrapper, document store helpers, search utilities |
| `@nodevault/platform.components.search` | `components/search` | Search/query builders |
| `@nodevault/platform.components.utils` | `components/utils` | Pure utilities — date, string, math (no Node.js-specific APIs) |
| `@nodevault/platform.components.utils.server` | `components/utils-server` | Server-only utilities — crypto, encoding, JWT |
| `@nodevault/platform.integrations.resend` | `integrations/resend` | Resend email client — `createResendClient`, `sendEmail` |
| `@nodevault/platform.integrations.cloudflare` | `integrations/cloudflare` | Cloudflare Workers helpers |

---

## Development

```bash
# Install dependencies
pnpm install

# Start servers (separate terminals)
pnpm run api          # API on :9002
pnpm run app          # NodeVault Nuxt on :9001
pnpm run nickchampion # Nick Champion Nuxt on :9003

# Type check everything
npx tsc --noEmit

# Run tests
npx vitest

# Lint with autofix
pnpm run lint

# Regenerate OpenAPI client types from schemas
pnpm run schemas
```

### Local hosts

Add to `/etc/hosts`:

```
127.0.0.1  api.nodevault.local
127.0.0.1  www.nodevault.local
127.0.0.1  www.nickchampion.local
```

### Configuration

Server config is passed as a base64-encoded JSON string in the `NODEVAULT` environment variable. Local overrides are read from the path in `NODEVAULT_OVERRIDES`. See `components/configuration/server/configuration.ts` for the full config schema.

---

## Deployment

| App | Platform | Command |
|-----|----------|---------|
| `apps/api` | Fly.io (Docker, `lhr`) | `fly deploy` from `apps/api/` |
| `apps/nodevault` | Cloudflare Workers | `pnpm run app:build` then `wrangler deploy` from `apps/nodevault/` |
| `apps/nickchampion` | Cloudflare Workers | build then `wrangler deploy` from `apps/nickchampion/` |
