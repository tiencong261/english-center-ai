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

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    const body = await request.json()
    const { title, content, attachmentUrl, submissionType = 'exercise' } = body

    if (!title || !content) {
      return createErrorResponse('Title and content are required', 400)
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: auth.userId },
    })

    if (!student) {
      return createErrorResponse('Student profile not found', 404)
    }

    // Create submission
    const submission = await prisma.studentSubmission.create({
      data: {
        title,
        content,
        attachmentUrl,
        submissionType,
        studentId: student.id,
        userId: auth.userId,
      },
      include: {
        feedback: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                role: true,
              },
            },
          },
        },
      },
    })

    return createJsonResponse(submission, { status: 201 })
  } catch (error) {
    console.error('Create submission error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const submissionType = searchParams.get('type')

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: auth.userId },
    })

    if (!student && auth.role === 'student') {
      return createErrorResponse('Student profile not found', 404)
    }

    const whereCondition: any = {}

    if (auth.role === 'student') {
      whereCondition.studentId = student?.id
    }

    if (submissionType) {
      whereCondition.submissionType = submissionType
    }

    const submissions = await prisma.studentSubmission.findMany({
      where: whereCondition,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
        feedback: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.studentSubmission.count({
      where: whereCondition,
    })

    return createJsonResponse(
      { submissions, total, limit, offset },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get submissions error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
