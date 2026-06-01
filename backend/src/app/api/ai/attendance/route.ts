// Attendance notification endpoint
export async function POST(req: Request) {
  try {
    const { studentName, course, absent } = await req.json()

    if (!absent) {
      return new Response(
        JSON.stringify({ success: true, notified: false }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Simulate sending notifications via SMS, Zalo, Email
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

    return new Response(
      JSON.stringify({
        success: true,
        studentName,
        course,
        notified: true,
        notifications,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
