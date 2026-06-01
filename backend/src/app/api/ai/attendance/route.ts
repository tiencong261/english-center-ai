import { createCorsResponse, corsOptionsResponse } from '@/lib/cors'

export async function OPTIONS() {
  return corsOptionsResponse()
}

// Attendance notification endpoint
export async function POST(req: Request) {
  try {
    const { studentName, course, absent } = await req.json()

    if (!absent) {
      return createCorsResponse({ success: true, notified: false })
    }

    const notifications = [
      {
        type: 'SMS',
        recipient: '+84987654321',
        message: `Hôm nay em ${studentName} vắng buổi học ${course}. Phụ huynh vui lòng liên hệ trung tâm nếu cần hỗ trợ.`,
      },
      {
        type: 'Email',
        recipient: 'parent@example.com',
        subject: `Thông báo vắng học - ${studentName}`,
        message: `Hôm nay em ${studentName} vắng buổi học ${course}. Phụ huynh vui lòng liên hệ trung tâm nếu cần hỗ trợ.`,
      },
      {
        type: 'Zalo',
        recipient: 'Zalo group',
        message: `Hôm nay em ${studentName} vắng buổi học ${course}. Phụ huynh vui lòng liên hệ trung tâm nếu cần hỗ trợ.`,
      },
    ]

    return createCorsResponse({
      success: true,
      studentName,
      course,
      notified: true,
      notifications,
    })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
