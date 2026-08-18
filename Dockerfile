# ── Stage 1: build the frontend ──────────────────────────────────────────────
FROM node:24-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN npm ci --workspace=frontend --ignore-scripts

COPY frontend ./frontend

# The address the built page names as its own — the canonical link, the social
# card and the sitemap entries — origin and mount path together. Left unset it
# is this site's own host at the root of it:
#   docker build --build-arg SITE_URL=https://example.org/tex/ .
ARG SITE_URL=
ENV SITE_URL=$SITE_URL


RUN npm run build --workspace=frontend

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN npm ci --workspace=backend --ignore-scripts

COPY backend ./backend

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 10422

ENV NODE_ENV=production
ENV PORT=10422

WORKDIR /app/backend
CMD ["node", "src/server.ts"]
