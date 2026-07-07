#!/bin/sh
set -e
echo "→ prisma migrate deploy"
pnpm exec prisma migrate deploy
echo "→ starting next server"
exec pnpm start
