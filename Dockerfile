FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma
RUN npx prisma generate
COPY backend/src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-builder /app/prisma ./prisma
COPY --from=frontend-builder /app/dist ./frontend/dist

COPY backend/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

USER appuser
ENV NODE_ENV=production
EXPOSE 4000
ENTRYPOINT ["sh", "entrypoint.sh"]
