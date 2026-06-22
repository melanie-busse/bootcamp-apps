# Stage 1: Bauen der Next.js App
FROM node:22-alpine AS build
WORKDIR /app

COPY apps/darkbay/frontend-next/package*.json ./
RUN npm install

COPY apps/darkbay/frontend-next/ .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Stage 2: Bereitstellen des Node.js-Servers
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]