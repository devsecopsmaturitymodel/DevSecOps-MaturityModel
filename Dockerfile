FROM node:18.7-alpine AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk add --upgrade python3 build-base \
 && npm install
COPY . .
RUN npm run build

FROM wurstbrot/dsomm-yaml-generation as yaml

FROM nginx:alpine

RUN chown -R nginx:nginx /var/cache/nginx \
 && chown -R nginx:nginx /var/log/nginx \
 && touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid

COPY --from=yaml ["/var/www/html/src/assets/YAML/generated/generated.yaml", "/usr/share/nginx/html/assets/YAML/generated/generated.yaml"]
COPY ["nginx/default.conf", "/etc/nginx/conf.d/"]
COPY --from=build ["/usr/src/app/dist/dsomm/", "/usr/share/nginx/html/"]

USER nginx
