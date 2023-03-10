# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# RUN npm i -g npm@7.7.6
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
# RUN npm i -g npm@7.7.6

RUN apk --no-cache add curl

ARG DOCS_URL
ENV DOCS_URL=${DOCS_URL}
ARG MAPBOX_TOKEN
ENV NEXT_PUBLIC_MAPBOX_TOKEN=${MAPBOX_TOKEN}
ARG WEBCOOS_API_TOKEN
ENV NEXT_PUBLIC_WEBCOOS_API_TOKEN=${WEBCOOS_API_TOKEN}
ARG WEBCOOS_API_URL
ENV NEXT_PUBLIC_WEBCOOS_API_URL=${WEBCOOS_API_URL}
ARG GOOGLE_ANALYTICS_MEASUREMENT_ID
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID=${GOOGLE_ANALYTICS_MEASUREMENT_ID}
ARG FEEDBACK_URL
ENV NEXT_PUBLIC_FEEDBACK_URL=${FEEDBACK_URL}

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run copyDocsRemote
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
# RUN npm i -g npm@7.7.6
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 3000

RUN npx next telemetry disable

CMD ["npm", "start"]
