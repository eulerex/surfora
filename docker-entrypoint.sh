#!/bin/sh
set -e
echo "→ prisma migrate deploy"
./node_modules/.bin/prisma migrate deploy
echo "→ prisma db seed (idempotent upserts)"
./node_modules/.bin/prisma db seed || echo "  (seed failed, continuing)"
echo "→ starting next server"
exec ./node_modules/.bin/next start
