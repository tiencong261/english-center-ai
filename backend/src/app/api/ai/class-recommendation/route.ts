import { createCorsResponse, corsOptionsResponse } from '@/lib/cors'

export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function POST(req: Request) {
  try {
    const { studentName, level, goals, preferredSchedule } = await req.json()
    const normalizedLevel = (level || '').toUpperCase()

    const recommendation = {
      studentName: studentName ?? 'Học viên',
      currentLevel: normalizedLevel || 'B1',
      goals: goals ?? 'Cải thiện speaking và đạt IELTS 6.5',
      recommendedCourses: [
        {
          name: normalizedLevel === 'B2' ? 'IELTS 7.0 Intensive' : 'IELTS 6.0 Foundation',
          level: normalizedLevel === 'B2' ? 'B2+' : 'B1',
          schedule: preferredSchedule?.length ? preferredSchedule : ['Mon Evening', 'Wed Evening'],
          reason: normalizedLevel === 'B2'
            ? 'Bạn đã có nền tảng tốt, nên thúc đẩy điểm Speaking và Writing để đạt mục tiêu.'
            : 'Nên củng cố ngữ pháp và vocabulary trước khi tiến lên lớp cao hơn.',
        },
      ],
      nextSteps: [
        'Hẹn lịch kiểm tra đầu vào kỹ năng writing và speaking.',
        'Tạo nhóm học nhỏ để tăng tương tác.',
        'Theo dõi điểm progress hàng tuần với giáo viên.',
      ],
    }

    return createCorsResponse({ recommendation })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
