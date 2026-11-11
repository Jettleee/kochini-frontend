# syntax=docker/dockerfile:1.7
# KOCHINI frontend image (FIT-118)
#   Stage 1 builds the React app with Node.
#   Stage 2 serves the static files with an unprivileged nginx (UID 101, port 8080).
# Nothing secret is baked into the image: the API URL is injected at container start
# through /env-config.js (see docker/entrypoint.d/15-kochini-config.sh).

ARG NODE_IMAGE=node:22.12.0-alpine3.20
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.27.3-alpine3.20

# ---------- build ----------
FROM ${NODE_IMAGE} AS build
WORKDIR /app

# Install dependencies first so this layer is cached until the lockfile changes
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---------- runtime ----------
FROM ${NGINX_IMAGE} AS runtime

ARG APP_VERSION=dev
ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="kochini-frontend" \
      org.opencontainers.image.description="KOCHINI coaching platform web client" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}"

# Runtime settings (override with -e / app settings). API_URL is public config, not a secret.
ENV API_URL=/api \
    APP_VERSION=${APP_VERSION}

# Config and app files stay owned by root: the nginx user can read them but not change them.
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chmod=0755 docker/entrypoint.d/15-kochini-config.sh /docker-entrypoint.d/15-kochini-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

USER 101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
