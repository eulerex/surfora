#!/bin/sh
set -e
echo "→ prisma migrate deploy"
node ./node_modules/prisma/build/index.js migrate deploy
echo "→ starting next standalone server"
exec node server.js
