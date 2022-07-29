FROM node:18.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM bitnami/nginx:latest
COPY nginx/location.conf /opt/bitnami/nginx/conf/bitnami/location.conf
COPY --from=build /usr/src/app/dist/dsomm/ /app
