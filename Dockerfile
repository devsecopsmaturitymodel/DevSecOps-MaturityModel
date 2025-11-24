FROM node:25.2.1-alpine3.22 AS build

ARG COMMIT_HASH
ARG COMMIT_DATE
ARG GIT_BRANCH

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN apk add --upgrade python3 build-base py3-setuptools py3-pip \
    && pip3 install --break-system-packages setuptools \
    && npm install
COPY . .
RUN npm run build --configuration=production

RUN mkdir -p /usr/src/app/dist/dsomm/assets && \
    echo "commit: \"${COMMIT_HASH:-unknown}\"" > /usr/src/app/dist/dsomm/assets/build-info.yaml && \
    echo "commit_date: \"${COMMIT_DATE:-unknown}\"" >> /usr/src/app/dist/dsomm/assets/build-info.yaml && \
    echo "branch: \"${GIT_BRANCH:-unknown}\"" >> /usr/src/app/dist/dsomm/assets/build-info.yaml


FROM wurstbrot/dsomm-yaml-generation:1.18.0 AS yaml

FROM caddy:2.10.2
ENV PORT=8080

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build ["/usr/src/app/dist/dsomm/", "/srv"]
COPY --from=yaml ["/var/www/html/src/assets/YAML/generated/generated.yaml", "/srv/assets/YAML/generated/generated.yaml"]
