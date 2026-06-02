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
    const attendancePercent = totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100)

    const academicReport = {
      studentName: studentName ?? 'Unknown',
      month: month ?? new Date().toISOString().slice(0, 7),
      attendance: `${attendancePercent}%`,
      vocabulary: 'Khá',
      speaking: 'Cần cải thiện',
      predicted: 'IELTS 6.0 sau 2 tháng',
      courses: student?.enrolls.map((enroll) => enroll.course.name) ?? ['IELTS 5.5'],
      summary: `Học viên có ${presentCount} trên ${totalClasses} buổi hiện diện. Nên tập trung vào Speaking và giữ vững Vocabulary.`,
    }

    return createCorsResponse({ academicReport })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
