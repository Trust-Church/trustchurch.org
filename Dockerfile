# syntax=docker/dockerfile:1.7

##############################################
# Next.js 15 + React 19 production image
# - Build with devDependencies available
# - Prune to prod deps for runtime
##############################################

# 1) Install ALL dependencies (incl. dev) for building
FROM node:20-bookworm-slim AS deps-dev

WORKDIR /app
ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci


# 2) Build the app using the full node_modules
FROM node:20-bookworm-slim AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

# Firebase credentials are supplied as BuildKit secrets by GitHub Actions.
# They are available only during this RUN instruction and are NOT copied
# into the resulting image.
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=secret,id=FIREBASE_PROJECT_ID \
    --mount=type=secret,id=FIREBASE_PRIVATE_KEY \
    --mount=type=secret,id=FIREBASE_CLIENT_EMAIL \
    --mount=type=secret,id=FIREBASE_STORAGE_BUCKET \
    export FIREBASE_PROJECT_ID="$(cat /run/secrets/FIREBASE_PROJECT_ID)" && \
    export FIREBASE_PRIVATE_KEY="$(cat /run/secrets/FIREBASE_PRIVATE_KEY)" && \
    export FIREBASE_CLIENT_EMAIL="$(cat /run/secrets/FIREBASE_CLIENT_EMAIL)" && \
    export FIREBASE_STORAGE_BUCKET="$(cat /run/secrets/FIREBASE_STORAGE_BUCKET)" && \
    npm run build

# 3) Install PRODUCTION-ONLY dependencies in a clean layer
FROM node:20-bookworm-slim AS prod-deps

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# 4) Minimal runtime image
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005

USER root

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Switch to non-root user
USER node

EXPOSE 3005

CMD ["npm", "run", "start", "--", "-p", "3005"]
