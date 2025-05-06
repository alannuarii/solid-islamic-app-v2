# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Salin package file terlebih dahulu
COPY package*.json ./
COPY app.config.js ./
COPY .env* ./
COPY ./ ./

RUN npm install
RUN npm run build

# Stage 2: Run
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
