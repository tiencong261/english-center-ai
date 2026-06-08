import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { generateToken } from '@/lib/jwt'
import { createJsonResponse, createErrorResponse } from '@/lib/auth'

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
    const body = await request.json()
    const { email, password, fullName, role = 'student' } = body

    if (!email || !password || !fullName) {
      return createErrorResponse('Email, password, and fullName are required', 400)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return createErrorResponse('Email already registered', 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    })

    // If role is student, create student profile
    if (role === 'student') {
      await prisma.student.create({
        data: {
          userId: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    }

    // If role is staff, create staff profile
    if (role === 'staff') {
      await prisma.staff.create({
        data: {
          userId: user.id,
        },
      })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return createJsonResponse(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
