# syntax=docker/dockerfile:1.7

##############################################
# Trust Church - Next.js 15 + React 19
# Production Docker image
##############################################

# 1) Install ALL dependencies, including devDependencies,
#    because TypeScript/Next.js tooling is required to build.
FROM node:22-bookworm-slim AS deps-dev

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=optional


# 2) Build the Next.js application.
FROM node:22-bookworm-slim AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

# Trust Church Firebase Admin configuration.
#
# These values are supplied by the GitHub Actions
# DOCKERHUB environment as Docker build arguments.
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY
ARG FIREBASE_STORAGE_BUCKET

ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY
ENV FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET

# Verify Firestore dependency exists before building.
RUN node -e "require('@google-cloud/firestore'); console.log('Firestore dependency OK')"

RUN --mount=type=cache,target=/root/.npm \
    npm run build


# 3) Install production-only dependencies in a clean layer.
FROM node:22-bookworm-slim AS prod-deps

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --include=optional

# Verify Firestore is available in the runtime dependency set.
RUN node -e "require('@google-cloud/firestore'); console.log('Firestore runtime dependency OK')"


# 4) Minimal production runtime image.
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005

USER root

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

USER node

EXPOSE 3005

CMD ["npm", "run", "start", "--", "-p", "3005"]