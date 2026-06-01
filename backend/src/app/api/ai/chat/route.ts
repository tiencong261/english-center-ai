// Simple rule-based AI chat stub for MVP
export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()

    const text = (message || '').toLowerCase()
    // If user asks about duration for IELTS
    if (text.includes('mất bao lâu') || text.includes('how long') || text.includes('bao lâu')) {
      // check for level in context
      const level = context?.level ?? ''
      if (level && level.toLowerCase().includes('b1')) {
        const reply = `Nếu hiện tại trình độ khoảng B1, thường cần 4-6 tháng học tập trung. Anh/chị muốn em tư vấn khóa online hay học trực tiếp ạ?`
        return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } })
      }
      // not sure - escalate
      return new Response(JSON.stringify({ transferToAgent: true, reason: 'level_unknown' }), { headers: { 'Content-Type': 'application/json' } })
    }

    // Default fallback
    const reply = `Xin chào — tôi có thể giúp gì cho anh/chị liên quan đến khóa học?` 
    return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
