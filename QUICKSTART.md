# ⚡ QUICKSTART - English Center AI MVP

Get the MVP running in **5 minutes**.

## Option 1: Docker (Easiest ✅ Recommended)

```bash
# 1. Clone and enter directory
git clone <repo>
cd english-center-ai

# 2. Start all services (frontend, backend, PostgreSQL, Redis)
docker-compose up --build

# Wait for containers to be healthy (~30 seconds)

# 3. Open in browser
Frontend: http://localhost:5173
Backend API: http://localhost:3000

# Done! 🎉 Try creating a lead in the UI
```

**Stop everything:**
```bash
docker-compose down
```

---

## Option 2: Local Development (Need Node.js 20 + PostgreSQL)

```bash
# 1. Setup database
createdb english_center_dev

# 2. Clone repo
git clone <repo>
cd english-center-ai

# 3. Setup backend
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL="postgresql://user:password@localhost:5432/english_center_dev"
npm install
npm run prisma:generate
npm run dev
# Backend runs at http://localhost:3000

# 4. In a new terminal, setup frontend
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🧪 Test the MVP

**Frontend** (http://localhost:5173):
1. **Module 1: Lead CRM** - Click "Tạo Lead" → AI predicts lead quality, course, revenue
2. **Module 2: AI Chat** - Ask "Học IELTS 6.5 mất bao lâu?" → AI replies
3. **Module 3: Class Placement** - Click "Tìm Lớp" → AI finds matching class
4. **Module 4: Attendance** - Check "Học viên vắng" → AI sends notifications

**Backend API** (test with curl):
```bash
# Create a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyễn Văn A","phone":"0987654321","intent":"IELTS","target":"6.5"}'

# Chat with AI
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Học IELTS 6.5 mất bao lâu?","context":{"level":"B1"}}'

# Find class
curl -X POST http://localhost:3000/api/ai/class-placement \
  -H "Content-Type: application/json" \
  -d '{"student":"Nguyễn Văn A","level":"B1","schedule":["Mon Evening","Wed Evening"]}'

# Record attendance
curl -X POST http://localhost:3000/api/ai/attendance \
  -H "Content-Type: application/json" \
  -d '{"studentName":"Nguyễn Văn A","course":"IELTS 5.5","absent":true}'
```

---

## 📁 Project Structure

```
english-center-ai/
├── frontend/          ← React app (http://localhost:5173)
│   ├── src/App.tsx   ← 4 module UI
│   └── Dockerfile
├── backend/           ← Next.js API (http://localhost:3000)
│   ├── src/app/api/   ← API routes
│   ├── prisma/        ← Database schema
│   └── Dockerfile
├── docker-compose.yml ← Orchestrate everything
└── README.md          ← Full documentation
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to database | Check `backend/.env` DATABASE_URL |
| Frontend can't reach backend | Make sure backend running on 3000 |
| "Prisma client not found" | Run `npm run prisma:generate` in backend/ |
| Port 3000/5173 already in use | `docker-compose down` or kill processes |

---

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [backend/AGENTS.md](./backend/AGENTS.md) for AI setup
- Deploy with Docker to your server

---

**Questions?** Check the main README.md or backend source code in `src/app/api/`.
