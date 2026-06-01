import prisma from '@/lib/prisma'

// Simple class placement logic: find available class matching student level and schedule
export async function POST(req: Request) {
  try {
    const { student, level, schedule } = await req.json()

    // Mock: find class with available slots matching level and schedule
    // In production, query database for classes
    const mockClasses = [
      {
        id: 1,
        name: 'IELTS 5.5',
        level: 'B1',
        schedule: ['Mon Evening', 'Wed Evening'],
        time: '18:00-20:00',
        availableSlots: 3,
      },
      {
        id: 2,
        name: 'IELTS 6.0',
        level: 'B2',
        schedule: ['Tue Evening', 'Thu Evening'],
        time: '18:30-20:30',
        availableSlots: 1,
      },
    ]

    // Filter classes matching student level and schedule
    const matchedClass = mockClasses.find(
      (cls) =>
        cls.level === level &&
        schedule.some((s: string) => cls.schedule.includes(s))
    )

    if (matchedClass && matchedClass.availableSlots > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          placement: {
            student,
            class: matchedClass.name,
            classId: matchedClass.id,
            schedule: matchedClass.schedule.join(', '),
            time: matchedClass.time,
            availableSlots: matchedClass.availableSlots,
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Không tìm thấy lớp phù hợp',
      }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
