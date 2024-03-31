FROM node:18.7-alpine AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk add --upgrade python3 build-base \
 && npm install
COPY . .
RUN npm run build

FROM wurstbrot/dsomm-yaml-generation as yaml

FROM caddy
ENV PORT 8080

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build ["/usr/src/app/dist/dsomm/", "/srv"]
COPY --from=yaml ["/var/www/html/src/assets/YAML/generated/generated.yaml", "/srv/assets/YAML/generated/generated.yaml"]