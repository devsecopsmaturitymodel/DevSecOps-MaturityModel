FROM node:18.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM bitnami/nginx:latest
#COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/dsomm/ /app