import { createCorsResponse, corsOptionsResponse } from '@/lib/cors'

export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function POST(req: Request) {
  try {
    const { studentName, course, level, topic } = await req.json()
    const normalizedLevel = (level || '').toUpperCase()
    const courseName = course || 'General English'
    const lessonTopic = topic || 'Vocabulary & Speaking'

    const vocabulary = [
      { word: 'fluency', meaning: 'Sự lưu loát khi nói', example: 'Practice daily to build fluency.' },
      { word: 'collocation', meaning: 'Từ thường đi cùng nhau', example: 'Strong collocation improves natural speech.' },
      { word: 'accuracy', meaning: 'Độ chính xác', example: 'Focus on pronunciation accuracy.' },
      { word: 'coherence', meaning: 'Sự mạch lạc', example: 'Answer questions with coherence.' },
      { word: 'engagement', meaning: 'Sự tương tác', example: 'Class engagement helps memory.' },
    ]

    const homework = [
      `Viết một đoạn văn 80-100 từ về chủ đề "${lessonTopic}".`,
      `Ghi âm 2 câu hỏi và trả lời bằng tiếng Anh, sau đó nghe lại để kiểm tra phát âm.`,
      `Học 10 từ vựng mới và tạo 2 câu với mỗi từ.`,
    ]

    const quiz = [
      {
        question: `Which sentence is more appropriate for ${normalizedLevel === 'B1' ? 'intermediate' : 'advanced'} speaking?`,
        options: ['I like study English.', 'I enjoy learning English every day.', 'English is good.'],
        answer: 'I enjoy learning English every day.',
      },
      {
        question: 'Which expression shows agreement politely?',
        options: ['No way.', 'I totally agree with you.', 'I hate that.'],
        answer: 'I totally agree with you.',
      },
      {
        question: 'What is the best strategy for improving vocabulary?',
        options: ['Memorize words without context.', 'Use words in sentences.', 'Only read grammar books.'],
        answer: 'Use words in sentences.',
      },
    ]

    const assistantPlan = {
      studentName: studentName ?? 'Học viên',
      course: courseName,
      level: normalizedLevel || 'B1',
      topic: lessonTopic,
      vocabulary,
      homework,
      quiz,
      teacherNote: `Lên kế hoạch bài giảng cho ${studentName ?? 'học viên'}: tập trung vào speaking, phát âm và mở rộng từ vựng cho ${courseName}.`, 
    }

    return createCorsResponse({ assistantPlan })
  } catch (err) {
    return createCorsResponse({ error: String(err) }, { status: 500 })
  }
}
