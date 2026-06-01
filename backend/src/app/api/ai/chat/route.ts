import { createCorsResponse, corsOptionsResponse } from '@/lib/cors'

// Simple rule-based AI chat stub for MVP
export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()

    const text = (message || '').toLowerCase()
    // If user asks about duration for IELTS
    if (text.includes('mất bao lâu') || text.includes('how long') || text.includes('bao lâu')) {
      const level = context?.level ?? ''
      if (level && level.toLowerCase().includes('b1')) {
        const reply = `Nếu hiện tại trình độ khoảng B1, thường cần 4-6 tháng học tập trung. Anh/chị muốn em tư vấn khóa online hay học trực tiếp ạ?`
        return createCorsResponse({ reply })
      }
      return createCorsResponse({ transferToAgent: true, reason: 'level_unknown' })
    }

    const reply = `Xin chào — tôi có thể giúp gì cho anh/chị liên quan đến khóa học?`
    return createCorsResponse({ reply })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
