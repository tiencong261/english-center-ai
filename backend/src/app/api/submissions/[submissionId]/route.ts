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
  { params }: { params: { submissionId: string } }
) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    const submissionId = parseInt(params.submissionId)

    if (!submissionId) {
      return createErrorResponse('Submission ID is required', 400)
    }

    // Get submission with all feedback
    const submission = await prisma.studentSubmission.findUnique({
      where: { id: submissionId },
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!submission) {
      return createErrorResponse('Submission not found', 404)
    }

    // Check authorization - student can only view their own submission
    if (
      auth.role === 'student' &&
      submission.userId !== auth.userId
    ) {
      return createErrorResponse('Unauthorized', 403)
    }

    return createJsonResponse(submission, { status: 200 })
  } catch (error) {
    console.error('Get submission error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
