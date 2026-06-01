# English Center AI MVP - Version 1

🎓 Hệ thống quản lý trung tâm tiếng Anh AI-powered với CRM, AI tư vấn, xếp lớp và điểm danh tự động.

## 🚀 MVP Modules (Version 1)

✅ **Module 1: AI Lead CRM** - Khách để lại thông tin → AI tự động dự đoán mức độ hot, khóa học, doanh thu ước tính  
✅ **Module 2: AI Chat Tư Vấn** - Khách nhắn tin → AI trả lời câu hỏi tư vấn hoặc chuyển cho nhân viên  
✅ **Module 3: AI Xếp Lớp** - Nhập trình độ + lịch → AI tìm lớp phù hợp với chỗ còn trống  
✅ **Module 4: AI Attendance** - Giáo viên ghi vắng → AI gửi SMS/Email/Zalo tới phụ huynh  

## 📋 Tech Stack

- **Frontend**: React 19 + Vite (TypeScript)
- **Backend**: Next.js 16 + Node.js 20
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5
- **Containerization**: Docker + Docker Compose
- **AI**: Rule-based logic (extensible to Claude/OpenAI)

## 🏗️ Project Structure

```
english-center-ai/
├── frontend/                    # React Vite app
│   ├── src/
│   │   ├── App.tsx             # MVP UI with 4 modules
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   └── package.json
├── backend/                     # Next.js + Prisma
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── leads/route.ts              # Module 1: Create lead + AI prediction
│   │   │   │   └── ai/
│   │   │   │       ├── chat/route.ts           # Module 2: AI chat
│   │   │   │       ├── class-placement/route.ts # Module 3: Class placement
│   │   │   │       └── attendance/route.ts      # Module 4: Attendance notification
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── lib/
│   │       └── prisma.ts       # Prisma client singleton
│   ├── prisma/
│   │   └── schema.prisma       # DB schema
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── docker-compose.yml          # Orchestrate backend + frontend + PostgreSQL + Redis
└── README.md

```

## 🛠️ Setup & Run

### Prerequisites

- Docker & Docker Compose installed
- OR: Node.js 20+, PostgreSQL 16, Redis 7 (for local dev)

### Option 1: Docker (Recommended)

```bash
# Clone repo
git clone <repo>
cd english-center-ai

# Build and start all services
docker-compose up --build

# Services available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### Option 2: Local Development

#### Setup Database

```bash
# Create PostgreSQL database
createdb english_center_dev

# Create user (if needed)
createuser -P english_center
```

#### Setup Backend

```bash
cd backend

# Copy .env file
cp .env.example .env

# Edit .env and set DATABASE_URL
# Example: postgresql://english_center:password@localhost:5432/english_center_dev

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# (Optional) Run migrations
npx prisma migrate dev --name init

# Start dev server
npm run dev
# Backend runs at http://localhost:3000
```

#### Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env (optional - defaults to localhost:3000)
echo "VITE_API_URL=http://localhost:3000" > .env

# Start dev server
npm run dev
# Frontend runs at http://localhost:5173
```

## 📚 API Endpoints

### POST /api/leads
Create a lead and get AI prediction.

**Request:**
```json
{
  "name": "Nguyễn Văn A",
  "phone": "0987654321",
  "intent": "IELTS",
  "target": "6.5"
}
```

**Response:**
```json
{
  "lead": { "id": 1, "name": "...", "createdAt": "..." },
  "prediction": {
    "level": "HOT",
    "course": "IELTS",
    "target": "6.5",
    "estimatedRevenue": 8000000
  }
}
```

### POST /api/ai/chat
Chat with AI - answers questions or escalates to human.

**Request:**
```json
{
  "message": "Học IELTS 6.5 mất bao lâu?",
  "context": { "level": "B1" }
}
```

**Response:**
```json
{
  "reply": "Nếu hiện tại trình độ khoảng B1, thường cần 4-6 tháng học tập trung..."
}
```
or
```json
{
  "transferToAgent": true,
  "reason": "level_unknown"
}
```

### POST /api/ai/class-placement
Find matching class for student.

**Request:**
```json
{
  "student": "Nguyễn Văn A",
  "level": "B1",
  "schedule": ["Mon Evening", "Wed Evening"]
}
```

**Response:**
```json
{
  "success": true,
  "placement": {
    "student": "Nguyễn Văn A",
    "class": "IELTS 5.5",
    "classId": 1,
    "schedule": "Mon Evening, Wed Evening",
    "time": "18:00-20:00",
    "availableSlots": 3
  }
}
```

### POST /api/ai/attendance
Record absence and notify parent.

**Request:**
```json
{
  "studentName": "Nguyễn Văn A",
  "course": "IELTS 5.5",
  "absent": true
}
```

**Response:**
```json
{
  "success": true,
  "studentName": "Nguyễn Văn A",
  "notified": true,
  "notifications": [
    {
      "type": "SMS",
      "recipient": "+84987654321",
      "message": "Hôm nay em Nguyễn Văn A vắng buổi học..."
    },
    ...
  ]
}
```

## 📦 Database Schema

### Students
```sql
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  level VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Courses
```sql
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  fee NUMERIC
);
```

### Enrollments
```sql
CREATE TABLE enrollments (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  course_id BIGINT REFERENCES courses(id),
  status VARCHAR(50) DEFAULT 'active'
);
```

### Attendance
```sql
CREATE TABLE attendance (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id),
  class_date DATE,
  present BOOLEAN
);
```

### Leads
```sql
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(20),
  intent VARCHAR(255),
  target VARCHAR(20),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Roadmap

### Version 1 (✅ Current)
- ✅ CRM Lead Management
- ✅ AI Chat Tư Vấn
- ✅ AI Xếp Lớp (rule-based)
- ✅ AI Attendance Notification

### Version 2
- 📋 Academic Reports (AI generates student progress reports)
- 📋 Parent Portal (parents view child's attendance, scores, skills)
- 📋 Enhanced attendance with real-time notifications

### Version 3
- 📋 AI Teacher Assistant (generate vocabulary, quizzes, homework)
- 📋 AI Class Recommendations (advanced placement logic)
- 📋 Integration with payment systems
- 📋 WhatsApp/Telegram integration

## 💰 Monetization

| Plan | Price | Features |
|------|-------|----------|
| Starter | $20/month | Lead CRM + Lead Management |
| Growth | $100/month | + AI Chat + Attendance |
| Pro | $300/month | + AI Reports + Parent Portal + Teacher Assistant |

## 📝 Development Notes

- Backend uses Next.js for API routes (can easily migrate to dedicated NestJS if needed)
- Prisma ORM handles all DB operations - easy to swap PostgreSQL for MySQL
- Rule-based AI can be replaced with Claude/OpenAI by updating route handlers
- Redis integration ready (connection string in .env)
- All APIs support CORS for frontend integration

## 🐛 Troubleshooting

**"Cannot connect to database"**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run `npx prisma db push` to sync schema

**"Frontend can't reach backend"**
- Check VITE_API_URL in frontend/.env
- Ensure backend is running on port 3000
- Check CORS in next.config.ts

**"Prisma client not generated"**
- Run `npx prisma generate` in backend/
- Delete node_modules/.prisma and regenerate

## 📞 Support

For questions or issues, check:
- Backend AGENTS.md & CLAUDE.md
- Frontend README.md
- Docker Compose logs: `docker-compose logs -f`

---

**Built with ❤️ for English Center AI**
