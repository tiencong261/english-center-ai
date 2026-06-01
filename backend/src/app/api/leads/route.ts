import prisma from '@/lib/prisma'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function createJsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...init.headers,
    },
    ...init,
  })
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, intent, target } = body

    const lead = await prisma.lead.create({
      data: {
        name: name ?? 'Unknown',
        phone: phone ?? '',
        intent: intent ?? '',
        target: target ?? '',
        metadata: body.metadata ?? null,
      },
    })

    const prediction = {
      level: 'HOT',
      course: intent?.toUpperCase().includes('IELTS') ? 'IELTS' : intent ?? 'General',
      target: target ?? '',
      estimatedRevenue: intent?.toUpperCase().includes('IELTS') ? 8000000 : 2000000,
    }

    return createJsonResponse({ lead, prediction }, { status: 201 })
  } catch (err) {
    console.error("LEADS ERROR:", err)
    return createJsonResponse({ error: String(err) }, { status: 500 })
  }
}
