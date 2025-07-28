FROM node:18.7.0-alpine3.18 AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN apk add --upgrade python3 build-base \
    && npm install
COPY . .
RUN npm run build

# dsomm-yaml-generation 1.15.3 is a release (not built everyday as 1.16.0)
FROM wurstbrot/dsomm-yaml-generation:1.15.3 as yaml

# Caddt v2.10.0 is latest release
FROM caddy:2.10.0
ENV PORT 8080

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build ["/usr/src/app/dist/dsomm/", "/srv"]
COPY --from=yaml ["/var/www/html/src/assets/YAML/generated/generated.yaml", "/srv/assets/YAML/generated/generated.yaml"]
