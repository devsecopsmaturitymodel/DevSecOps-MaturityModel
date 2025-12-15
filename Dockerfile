FROM node:18.7-alpine AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk add --upgrade python3 build-base \
 && npm install
COPY . .
RUN npm run build

FROM wurstbrot/dsomm-yaml-generation:1.24.0 as yaml

FROM caddy
ENV PORT 8080

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build ["/usr/src/app/dist/dsomm/", "/srv"]
RUN mkdir -p /srv/assets/YAML/default/
COPY --from=yaml ["/var/www/html/generated/model.yaml,", "/srv/assets/YAML/default/model.yaml"]
