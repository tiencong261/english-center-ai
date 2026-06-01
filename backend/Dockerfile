# Backend Dockerfile for Next.js + Prisma
FROM node:20-alpine

WORKDIR /app/backend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
