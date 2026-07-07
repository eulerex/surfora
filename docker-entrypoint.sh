#!/bin/sh
set -e
echo "→ prisma migrate deploy"
./node_modules/.bin/prisma migrate deploy
echo "→ starting next server"
exec ./node_modules/.bin/next start
