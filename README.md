# Surfora

Multi-language web frontend, part of the Surfora platform.

Tech: Next.js 16 · App Router · TypeScript · Tailwind CSS · next-intl

## Locales

`/ja` (default), `/zh`, `/en` — configured in `src/i18n/routing.ts`.

## Local dev

```bash
nvm use          # Node 20 (see .nvmrc)
pnpm install
pnpm dev
```

Open http://localhost:3000 — you get redirected to `/ja`.

## Production build

```bash
pnpm build
pnpm start
```

## Docker

`Dockerfile` uses Next.js `standalone` output. Multi-stage: deps → builder → runner. Final image runs as UID 1001, listens on `PORT=3000`.

```bash
docker build -t surfora .
docker run --rm -p 3000:3000 surfora
```

## Deployment

Served behind the platform Nginx at `/opt/apps/` — see the `server-archetect` repo for the wider architecture.
