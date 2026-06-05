import React, { useState, useEffect } from 'react';

interface Question {
  q: string;
  options: string[];
  answer: string;
}

interface StudentPortalProps {
  role: 'admin' | 'staff' | 'student';
  syncedQuiz: any;
}

export default function StudentPortal({ role, syncedQuiz }: StudentPortalProps) {
  // Local default quiz questions if no quiz is synced from Teacher Assistant
  const defaultQuestions: Question[] = [
    { q: 'Which of the following is a primary cause of global warming?', options: ['Fossil fuels burning', 'Organic farming', 'Water recycling', 'Planting trees'], answer: 'Fossil fuels burning' },
    { q: 'What does "biodegradable" mean?', options: ['Cannot decay', 'Harmful to animals', 'Can decay naturally', 'Man-made chemical'], answer: 'Can decay naturally' },
    { q: 'The act of converting waste into reusable material is called...', options: ['Polluting', 'Recycling', 'Decomposing', 'Combustion'], answer: 'Recycling' },
    { q: 'Sustainability aims to protect which resources?', options: ['Only financial', 'Natural resources', 'Only computer hardware', 'None'], answer: 'Natural resources' },
    { q: 'Deforestation refers to...', options: ['Planting forests', 'Clearing forests', 'Water purification', 'Animal migration'], answer: 'Clearing forests' },
    { q: 'Which gas is most associated with the greenhouse effect?', options: ['Oxygen', 'Carbon Dioxide', 'Hydrogen', 'Helium'], answer: 'Carbon Dioxide' },
    { q: 'Renewable energy source includes...', options: ['Coal', 'Petroleum', 'Solar', 'Natural gas'], answer: 'Solar' },
    { q: 'Ecological footprint measures...', options: ['Physical shoe size', 'Human impact on ecosystems', 'Depth of soil', 'Carbon weight'], answer: 'Human impact on ecosystems' },
    { q: 'What is a major threat to marine life?', options: ['Plastic pollution', 'Rainwater', 'Seaweed growth', 'Ocean waves'], answer: 'Plastic pollution' },
    { q: 'To conserve energy, one should...', options: ['Leave lights on', 'Turn off appliances', 'Drive larger cars', 'Use plastic bags'], answer: 'Turn off appliances' },
  ];

  const defaultWritingTask = "Writing Task 2: Some people believe that individuals can do little to protect the environment, and only governments can make a difference. To what extent do you agree or disagree?";

  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [writingPrompt, setWritingPrompt] = useState<string>(defaultWritingTask);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(10).fill(''));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [writingInput, setWritingInput] = useState('');
  const [writingGraded, setWritingGraded] = useState(false);
  const [writingFeedback, setWritingFeedback] = useState<any>(null);
  const [gradingLoading, setGradingLoading] = useState(false);

  useEffect(() => {
    if (syncedQuiz) {
      if (syncedQuiz.quiz && syncedQuiz.quiz.length > 0) {
        setQuestions(syncedQuiz.quiz);
        setSelectedAnswers(new Array(syncedQuiz.quiz.length).fill(''));
        setQuizSubmitted(false);
      }
      if (syncedQuiz.homework && syncedQuiz.homework.writingTask) {
        setWritingPrompt(syncedQuiz.homework.writingTask);
        setWritingInput('');
        setWritingGraded(false);
      }
    }
  }, [syncedQuiz]);

  const handleSelectOption = (qIdx: number, option: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => {
      const next = [...prev];
      next[qIdx] = option;
      return next;
    });
  };

  const handleSubmitQuiz = () => {
    let tempScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        tempScore += 1;
      }
    });
    setScore(tempScore);
    setQuizSubmitted(true);
    alert(`Bạn đã nộp bài trắc nghiệm thành công! Kết quả đạt được: ${tempScore}/${questions.length} câu đúng.`);
  };

  const handleGradeWriting = () => {
    if (writingInput.trim().length < 50) {
      alert("Bài viết quá ngắn! Vui lòng viết tối thiểu 50 từ để AI có thể đánh giá chính xác.");
      return;
    }

    setGradingLoading(true);
    // Simulate AI Writing Evaluator
    setTimeout(() => {
      const estimatedBand = 6.5;
      const feedback = {
        bandScore: estimatedBand,
        taskAchievement: 'Good (7.0) - Cung cấp luận điểm rõ ràng, cấu trúc mạch lạc, trả lời đầy đủ yêu cầu đề bài.',
        coherenceCohesion: 'Fair (6.5) - Chuyển ý tự nhiên, sử dụng đa dạng các từ nối (However, In addition, Consequently).',
        lexicalResource: 'Good (6.5) - Có sử dụng một số từ vựng chuyên môn về môi trường (biodegradable, greenhouse gases, carbon footprint).',
        grammaticalRange: 'Fair (6.0) - Cấu trúc câu đa dạng, tuy nhiên vẫn còn một số lỗi chia động từ nhỏ.',
        corrections: [
          { original: 'Governments should makes policy...', suggestion: 'Governments should make policy...', explanation: 'Động từ khuyết thiếu "should" đi kèm với động từ nguyên thể.' },
          { original: 'The pollution increase rapidly...', suggestion: 'The pollution is increasing rapidly...', explanation: 'Nên dùng thì hiện tại tiếp diễn để mô tả xu hướng đang diễn ra.' }
        ]
      };
      setWritingFeedback(feedback);
      setWritingGraded(true);
      setGradingLoading(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0 }}>📝 Cổng Làm Bài Cho Học Viên (Student Portal)</h2>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Dành riêng cho Học sinh vào làm bài thi/kiểm tra tự động đồng bộ từ Giáo viên. Làm bài trực tuyến, nộp bài nhận chấm điểm & phản hồi sửa lỗi tức thì bằng Trí tuệ nhân tạo AI.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* MCQ Quiz Panel */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>✍️ Bài Kiểm Tra Trắc Nghiệm ({questions.length} Câu)</h3>
            {quizSubmitted && (
              <strong style={{ fontSize: '1.1rem', color: score >= 7 ? '#4caf50' : '#ff9800' }}>
                Kết quả: {score}/{questions.length} ({Math.round(score/questions.length * 100)}%)
              </strong>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {questions.map((q, qIdx) => (
              <div key={qIdx} style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: '#f9fafb', border: '1px solid #edf2f7' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                  Câu {qIdx + 1}: {q.q}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[qIdx] === opt;
                    const isCorrect = q.answer === opt;
                    let optionBg = 'white';
                    let optionColor = '#333';
                    let optionBorder = '1px solid #cbd5e0';

                    if (isSelected) {
                      optionBg = '#e2e8f0';
                      optionBorder = '1.5px solid #4a5568';
                    }

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionBg = '#c6f6d5';
                        optionColor = '#22543d';
                        optionBorder = '1.5px solid #48bb78';
                      } else if (isSelected) {
                        optionBg = '#fed7d7';
                        optionColor = '#742a2a';
                        optionBorder = '1.5px solid #f56565';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, opt)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: optionBorder,
                          backgroundColor: optionBg,
                          color: optionColor,
                          fontSize: '0.8rem',
                          textAlign: 'left',
                          cursor: quizSubmitted ? 'not-allowed' : 'pointer',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#aa3bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              Nộp Bài Trắc Nghiệm
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedAnswers(new Array(questions.length).fill(''));
                setQuizSubmitted(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#718096',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              Làm Lại Bài Thi
            </button>
          )}
        </div>

        {/* Writing Essay & AI Evaluation Panel */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>✍️ Luyện Viết Bài Tập Về Nhà (Writing Essay)</h3>
          
          <div style={{ padding: '0.75rem', backgroundColor: '#fffaf0', border: '1px solid #fbd38d', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <strong>Đề bài giao từ Giáo viên / AI Assistant:</strong>
            <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>{writingPrompt}</p>
          </div>

          <textarea
            placeholder="Nhập bài viết luận tiếng Anh của bạn tại đây (tối thiểu 50 từ)..."
            value={writingInput}
            onChange={(e) => setWritingInput(e.target.value)}
            disabled={writingGraded || gradingLoading}
            style={{
              width: '100%',
              minHeight: '140px',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
              outline: 'none',
              resize: 'vertical'
            }}
          />

          {!writingGraded ? (
            <button
              onClick={handleGradeWriting}
              disabled={gradingLoading}
              style={{
                padding: '0.75rem',
                backgroundColor: '#319795',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              {gradingLoading ? 'AI Đang Chấm Điểm & Phân Tích...' : 'Nộp Bài & Nhận Nhận Xét AI'}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#e6fffa', border: '1px solid #b2f5ea', borderRadius: '6px' }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#00695c' }}>🏆 Điểm số ước tính: IELTS Band {writingFeedback?.bandScore}</strong>
                <p style={{ fontSize: '0.8rem', color: '#004d40', marginTop: '0.25rem', margin: 0 }}>
                  <strong>Task Response:</strong> {writingFeedback?.taskAchievement}<br />
                  <strong>Coherence & Cohesion:</strong> {writingFeedback?.coherenceCohesion}<br />
                  <strong>Lexical Resource:</strong> {writingFeedback?.lexicalResource}<br />
                  <strong>Grammatical Range:</strong> {writingFeedback?.grammaticalRange}
                </p>
              </div>

              {/* Grammar corrections */}
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#e53e3e', display: 'block', marginBottom: '0.25rem' }}>🔧 Sửa lỗi ngữ pháp gợi ý bởi AI:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {writingFeedback?.corrections.map((corr: any, idx: number) => (
                    <div key={idx} style={{ padding: '0.5rem', backgroundColor: '#fff5f5', borderRadius: '4px', border: '1px solid #fed7d7', fontSize: '0.8rem' }}>
                      <span style={{ textDecoration: 'line-through', color: '#e53e3e' }}>"{corr.original}"</span>
                      <span style={{ color: '#38a169', fontWeight: 'bold', marginLeft: '0.5rem' }}>➔ "{corr.suggestion}"</span>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#4a5568' }}>{corr.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setWritingInput('');
                  setWritingGraded(false);
                  setWritingFeedback(null);
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#718096',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}
              >
                Viết Bài Khác / Thử Lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
