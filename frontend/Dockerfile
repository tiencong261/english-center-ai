# Frontend Dockerfile for Vite React
FROM node:20-alpine as builder

WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app/frontend

# Install a simple HTTP server to serve dist
RUN npm install -g serve

COPY --from=builder /app/frontend/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
