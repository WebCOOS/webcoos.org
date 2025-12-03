# Install dependencies only when needed
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:24-alpine AS builder

# RUN apk --no-cache add curl
WORKDIR /app
COPY package.json package-lock.json ./
COPY public  public
COPY index.html index.html
COPY src  src
COPY eslint.config.js vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY --from=deps /app/node_modules ./node_modules

# build-time config values
ARG VITE_PUBLIC_WEBCOOS_API_TOKEN
ARG VITE_PUBLIC_WEBCOOS_API_URL
ARG VITE_PUBLIC_FEEDBACK_URL

RUN npm run build

# Production image, copy all the files and run vite
FROM nginx:1.25.1 AS nginx
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist/ /usr/share/nginx/html

COPY ./docker/nginx/conf.d/* /etc/nginx/conf.d/

EXPOSE 80
