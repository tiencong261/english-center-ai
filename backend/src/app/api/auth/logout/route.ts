import { NextRequest } from 'next/server'
import { requireAuth, createJsonResponse, createErrorResponse } from '@/lib/auth'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    // User is authenticated, can logout
    // Since we're using JWT, logout is handled on the client side by removing the token
    return createJsonResponse(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
