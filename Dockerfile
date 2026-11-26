# SARAS Device Portal website: the built React app served by nginx (non-root, port 8080).
#   docker build -t saras-device-portal-web:0.2.0 frontend
# nginx also forwards /api and /health to the API (API_UPSTREAM, default http://saras-portal-api:8080), so the browser
# sees one site and config.json keeps "apiBaseUrl": "". Mount another /usr/share/nginx/html/config.json to change it.

FROM node:20 AS build
WORKDIR /w
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
ARG VERSION=0.2.0
LABEL org.opencontainers.image.title="SARAS Device Portal website" org.opencontainers.image.vendor="Excelsoft" org.opencontainers.image.version="${VERSION}"
ENV API_UPSTREAM=http://saras-portal-api:8080
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /w/dist /usr/share/nginx/html
EXPOSE 8080
