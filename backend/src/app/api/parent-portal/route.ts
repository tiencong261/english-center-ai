import { createCorsResponse, corsOptionsResponse } from '@/lib/cors'
import prisma from '@/lib/prisma'

export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function POST(req: Request) {
  try {
    const { studentName, month } = await req.json()

    const student = await prisma.student.findFirst({
      where: { fullName: studentName },
      include: { attendance: true, enrolls: { include: { course: true } } },
    })

    const attendanceRecords = student?.attendance ?? []
    const totalClasses = Math.max(attendanceRecords.length, 8)
    const presentCount = attendanceRecords.filter((item) => item.present).length
    const attendanceDetail = `${presentCount}/${totalClasses}`

    const portalData = {
      studentName: studentName ?? 'Unknown',
      month: month ?? new Date().toISOString().slice(0, 7),
      attendance: attendanceDetail,
      score: 85,
      bestSkill: 'Listening',
      needsImprovement: 'Speaking',
      courses: student?.enrolls.map((enroll) => enroll.course.name) ?? ['IELTS 5.5'],
      note: 'Tháng này em đi học đều và tiến bộ tốt. Nên tiếp tục luyện speaking mỗi ngày.',
    }

    return createCorsResponse({ parentPortal: portalData })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
