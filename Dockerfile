# Install dependencies only when needed
FROM node:alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:alpine AS builder

RUN apk --no-cache add curl

ARG DOCS_URL
ENV DOCS_URL=${DOCS_URL}
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run copyDocsRemote
RUN npm run build

# Production image, copy all the files and run next
FROM node:alpine AS runner
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
