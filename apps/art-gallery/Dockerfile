# --- STAGE 1: Dependencies installieren ---
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/Art-Gallery/package.json ./apps/Art-Gallery/

RUN npm ci

# --- STAGE 2: Anwendung bauen ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build -w apps/Art-Gallery

# --- STAGE 3: Minimales Produktions-Image ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiert den Monorepo-Standalone-Build
COPY --from=builder --chown=nextjs:nodejs /app/apps/art-gallery/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/art-gallery/.next/static ./apps/art-gallery/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/art-gallery/public ./apps/art-gallery/public

USER nextjs
EXPOSE 3000

# Durch das neue Tracing liegt die server.js jetzt wieder im Unterordner,
# hat aber alle echten Node-Module physisch mit an Bord!
CMD ["node", "apps/art-gallery/server.js"]