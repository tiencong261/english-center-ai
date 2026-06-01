#!/bin/bash

# English Center AI - Quick Setup Script
# Installs dependencies and generates Prisma client for both backend and frontend

set -e

echo "🚀 English Center AI - Setup Script"
echo "===================================="

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
  echo "  Creating .env from .env.example..."
  cp .env.example .env
  echo "  ⚠️  Please edit backend/.env and set DATABASE_URL before running npm run dev"
fi

echo "  Installing dependencies..."
npm install

echo "  Generating Prisma client..."
npm run prisma:generate

echo "✅ Backend setup complete"

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

echo "  Installing dependencies..."
npm install

echo "✅ Frontend setup complete"

echo ""
echo "===================================="
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "  1. Edit backend/.env and set DATABASE_URL (if not already set)"
echo "  2. Run: docker-compose up (for full stack with PostgreSQL)"
echo "  OR"
echo "  2. In one terminal: cd backend && npm run dev"
echo "  3. In another terminal: cd frontend && npm run dev"
echo ""
echo "🌐 Access:"
echo "  Frontend: http://localhost:5173"
echo "  Backend: http://localhost:3000"
