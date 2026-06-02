import { createCorsResponse, corsOptionsResponse } from '@/lib/cors'

export async function OPTIONS() {
  return corsOptionsResponse()
}

function generateInvoiceId() {
  return `INV-${Math.floor(100000 + Math.random() * 900000)}`
}

export async function POST(req: Request) {
  try {
    const { studentName, course, amount, dueDate } = await req.json()
    const invoiceId = generateInvoiceId()
    const invoice = {
      invoiceId,
      studentName: studentName ?? 'Học viên',
      course: course ?? 'General English Program',
      amount: amount ?? 3500000,
      dueDate: dueDate ?? new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'pending',
      paymentLink: `https://pay.example.com/${invoiceId}`,
      note: 'Gửi hoá đơn học phí và tạo đường dẫn thanh toán nhanh cho phụ huynh.',
    }

    return createCorsResponse({ invoice })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
