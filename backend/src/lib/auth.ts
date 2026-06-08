import { NextRequest } from 'next/server'
import { verifyToken, TokenPayload } from './jwt'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function createJsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...init.headers,
    },
    ...init,
  })
}

export function createErrorResponse(message: string, status: number = 400) {
  return createJsonResponse({ error: message }, { status })
}

export async function getAuthToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.slice(7)
}

export async function verifyAuth(request: NextRequest): Promise<TokenPayload | null> {
  const token = await getAuthToken(request)
  if (!token) {
    return null
  }
  return verifyToken(token)
}

export async function requireAuth(request: NextRequest): Promise<TokenPayload | { error: Response }> {
  const auth = await verifyAuth(request)
  if (!auth) {
    return { error: createErrorResponse('Unauthorized', 401) }
  }
  return auth
}
