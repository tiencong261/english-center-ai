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

    // Get current user profile
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            level: true,
            parentEmail: true,
            parentPhone: true,
          },
        },
        staff: {
          select: {
            id: true,
            position: true,
            department: true,
          },
        },
      },
    })

    if (!user) {
      return createErrorResponse('User not found', 404)
    }

    return createJsonResponse(user, { status: 200 })
  } catch (error) {
    console.error('Get user profile error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    const body = await request.json()
    const { fullName, phone, avatar, parentEmail, parentPhone } = body

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        student: {
          select: {
            id: true,
            level: true,
            parentEmail: true,
            parentPhone: true,
          },
        },
      },
    })

    // Update student profile if role is student
    if (auth.role === 'student' && (parentEmail || parentPhone)) {
      await prisma.student.update({
        where: { userId: auth.userId },
        data: {
          ...(parentEmail && { parentEmail }),
          ...(parentPhone && { parentPhone }),
        },
      })
    }

    return createJsonResponse(updatedUser, { status: 200 })
  } catch (error) {
    console.error('Update user profile error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
