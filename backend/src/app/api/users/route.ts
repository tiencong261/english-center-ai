import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, createJsonResponse, createErrorResponse } from '@/lib/auth'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS })
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    // Only admin can list all users
    if (auth.role !== 'admin') {
      return createErrorResponse('Unauthorized', 403)
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const whereCondition: any = {}

    if (role) {
      whereCondition.role = role
    }

    if (search) {
      whereCondition.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.user.count({
      where: whereCondition,
    })

    return createJsonResponse(
      { users, total, limit, offset },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get users error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
