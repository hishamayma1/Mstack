# syntax=docker/dockerfile:1.7

# ── deps: install node_modules from the lockfile ───────────────────────────
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile                                              

# ── build: next build ──────────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# The build reads Payload collections ("use cache" + prerendering), so it
# needs DATABASE_URI, PAYLOAD_SECRET and the NEXT_PUBLIC_* values. .env is
# mounted as a build secret so it's never baked into an image layer.
RUN --mount=type=secret,id=app_env,target=/app/.env pnpm build

# ── run: production server ─────────────────────────────────────────────────
FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN corepack enable && addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=build --chown=nextjs:nodejs /app ./
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media
USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"]
