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
      {
        type: 'WhatsApp',
        recipient: '+84987654321',
        message: `📌 Thông báo: ${studentName} đã vắng buổi học ${course} hôm nay. Vui lòng kiểm tra sức khoẻ và liên hệ trung tâm.`,
      },
      {
        type: 'Telegram',
        recipient: '@phanhoidonghocsinh',
        message: `Thông báo vắng học: ${studentName} không có mặt trong buổi ${course} hôm nay.`,
      },
    ]

    return createCorsResponse({
      success: true,
      studentName,
      course,
      notified: true,
      notifications,
      integration: ['sms', 'email', 'zalo', 'whatsapp', 'telegram'],
    })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
