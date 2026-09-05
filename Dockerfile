# syntax=docker/dockerfile:1.7

##############################################
# Next.js 15 + React 19 production image
##############################################

# 1) Install ALL dependencies for building
FROM node:20-bookworm-slim AS deps-dev

WORKDIR /app
ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci


# 2) Build the application
FROM node:20-bookworm-slim AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

RUN --mount=type=cache,target=/root/.npm \
    npm run build


# 3) Install production-only dependencies
FROM node:20-bookworm-slim AS prod-deps

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# 4) Runtime image
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005

USER root

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json

USER node

EXPOSE 3005

CMD ["npm", "run", "start", "--", "-p", "3005"]
