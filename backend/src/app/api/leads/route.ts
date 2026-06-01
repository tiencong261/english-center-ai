import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, intent, target } = body

    // create lead record
    const lead = await prisma.lead.create({
      data: {
        name: name ?? 'Unknown',
        phone: phone ?? '',
        intent: intent ?? '',
        target: target ?? '',
        metadata: body.metadata ?? null,
      },
    })

    // basic AI inference (MVP rule-based)
    const prediction = {
      level: 'HOT',
      course: intent?.toUpperCase().includes('IELTS') ? 'IELTS' : intent ?? 'General',
      target: target ?? '',
      estimatedRevenue: intent?.toUpperCase().includes('IELTS') ? 8000000 : 2000000,
    }

    return new Response(JSON.stringify({ lead, prediction }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
