import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, createJsonResponse, createErrorResponse } from '@/lib/auth'
import OpenAI from 'openai'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS })
}

async function generateAIFeedback(
  submissionContent: string,
  submissionType: string
): Promise<{
  comment: string
  strengths: string
  areasForImprovement: string
  suggestions: string
}> {
  try {
    const prompt = `You are an experienced English teacher. Please analyze the following ${submissionType} submission and provide detailed feedback.

Submission:
${submissionContent}

Please provide your feedback in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "comment": "Overall assessment of the submission",
  "strengths": "Key strengths of this submission (2-3 points)",
  "areasForImprovement": "Areas that need improvement (2-3 points)",
  "suggestions": "Specific suggestions for improvement"
}`

    const message = await openai.messages.create({
      model: process.env.OPENAI_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse the JSON response
    const feedback = JSON.parse(responseText)

    return {
      comment: feedback.comment || '',
      strengths: feedback.strengths || '',
      areasForImprovement: feedback.areasForImprovement || '',
      suggestions: feedback.suggestions || '',
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    // Return a fallback response if OpenAI fails
    return {
      comment: 'Unable to generate AI feedback at this time.',
      strengths: 'Please try again later.',
      areasForImprovement: '',
      suggestions: '',
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const auth = await requireAuth(request)
    if ('error' in auth) {
      return auth.error
    }

    // Only staff can provide feedback
    if (auth.role !== 'staff' && auth.role !== 'admin') {
      return createErrorResponse(
        'Only staff members can provide feedback',
        403
      )
    }

    const submissionId = parseInt(params.submissionId)
    const body = await request.json()
    const { useAI = false } = body

    if (!submissionId) {
      return createErrorResponse('Submission ID is required', 400)
    }

    // Get submission
    const submission = await prisma.studentSubmission.findUnique({
      where: { id: submissionId },
    })

    if (!submission) {
      return createErrorResponse('Submission not found', 404)
    }

    let feedbackData: {
      comment: string
      strengths: string
      areasForImprovement: string
      suggestions: string
      aiGenerated?: boolean
      aiModel?: string
    } = {
      comment: body.comment || '',
      strengths: body.strengths || '',
      areasForImprovement: body.areasForImprovement || '',
      suggestions: body.suggestions || '',
    }

    // Generate AI feedback if requested
    if (useAI && process.env.OPENAI_API_KEY) {
      const aiFeedback = await generateAIFeedback(
        submission.content,
        submission.submissionType
      )
      feedbackData = {
        ...aiFeedback,
        aiGenerated: true,
        aiModel: process.env.OPENAI_MODEL || 'claude-3-sonnet-20240229',
      }
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        submissionId,
        userId: auth.userId,
        comment: feedbackData.comment,
        score: body.score || null,
        strengths: feedbackData.strengths,
        areasForImprovement: feedbackData.areasForImprovement,
        suggestions: feedbackData.suggestions,
        aiGenerated: feedbackData.aiGenerated || false,
        aiModel: feedbackData.aiModel || null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    })

    // Update submission score if provided
    if (body.score !== undefined) {
      await prisma.studentSubmission.update({
        where: { id: submissionId },
        data: { score: body.score },
      })
    }

    return createJsonResponse(feedback, { status: 201 })
  } catch (error) {
    console.error('Create feedback error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
