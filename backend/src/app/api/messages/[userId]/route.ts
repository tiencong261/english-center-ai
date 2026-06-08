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

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    const userId = parseInt(params.userId)

    if (!userId) {
      return createErrorResponse('User ID is required', 400)
    }

    // Get messages between current user and specified user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: auth.userId, receiverId: userId },
          { senderId: userId, receiverId: auth.userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Mark received messages as read
    await prisma.message.updateMany({
      where: {
        AND: [{ receiverId: auth.userId }, { senderId: userId }, { isRead: false }],
      },
      data: {
        isRead: true,
      },
    })

    return createJsonResponse(messages, { status: 200 })
  } catch (error) {
    console.error('Get conversation error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
