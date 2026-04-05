FROM node:22-alpine AS builder
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ ./
RUN npx tsc

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/server.js"]
