FROM node:24.7.0-alpine3.22 AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN apk add --upgrade python3 build-base py3-setuptools py3-pip && \
    pip3 install setuptools \
    && npm install
COPY . .
RUN npm run build --configuration=production


FROM wurstbrot/dsomm-yaml-generation:1.16.0 AS yaml

FROM caddy:2.10.2
ENV PORT=8080

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build ["/usr/src/app/dist/dsomm/", "/srv"]
COPY --from=yaml ["/var/www/html/src/assets/YAML/generated/generated.yaml", "/srv/assets/YAML/generated/generated.yaml"]
