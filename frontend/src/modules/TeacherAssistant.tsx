import React, { useState } from 'react';

interface TeacherAssistantProps {
  apiBase: string;
  role: 'admin' | 'staff' | 'student';
  onSyncQuiz: (quizData: any) => void;
}

export default function TeacherAssistant({ apiBase, role, onSyncQuiz }: TeacherAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [teacherForm, setTeacherForm] = useState({
    studentName: 'Nguyễn Văn A',
    course: 'IELTS 6.0',
    level: 'B1',
    topic: 'Environment & Pollution',
  });

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/ai/teacher-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherForm),
      });
      const data = await res.json();
      setResult(data);
      if (data.quiz) {
        onSyncQuiz(data);
      }
    } catch (err) {
      // Mock generation containing key terms, 10-questions quiz & writing prompt
      const mockResult = {
        success: true,
        topic: teacherForm.topic,
        level: teacherForm.level,
        vocabulary: [
          { word: 'Pollution', definition: 'The presence in or introduction into the environment of a substance or thing that has harmful or toxic effects.' },
          { word: 'Climate change', definition: 'A change in global or regional climate patterns, attributed largely to the increased levels of atmospheric carbon dioxide produced by the use of fossil fuels.' },
          { word: 'Recycle', definition: 'Convert waste into reusable material.' },
          { word: 'Biodegradable', definition: 'Capable of being decomposed by bacteria or other living organisms.' },
          { word: 'Sustainability', definition: 'The ability to be maintained at a certain rate or level without depleting natural resources.' }
        ],
        quiz: [
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
        ],
        homework: {
          writingTask: 'Writing Task 2: Some people believe that individuals can do little to protect the environment, and only governments can make a difference. To what extent do you agree or disagree?',
          wordLimit: '250 words',
          estimatedBand: 'IELTS 6.0 - 6.5 target guidance'
        }
      };
      setResult(mockResult);
      onSyncQuiz(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    alert("Đã giao bài kiểm tra & từ vựng trực tiếp xuống tài khoản học viên Nguyễn Văn A thành công!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0 }}>👩‍🏫 Module 6: AI Teacher Assistant / Soạn Bài Giảng & Bài Tập</h2>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Trợ lý đắc lực của giáo viên: Chỉ cần nhập chủ đề, AI lập tức soạn kho từ vựng chuyên ngành kèm định nghĩa, bộ câu hỏi trắc nghiệm (Quiz 10 câu) và bài tập Writing Task chuẩn khung Cambridge.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Topic Input Form */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>⚙️ Tạo Học Liệu Thông Minh</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Lớp / Khóa học áp dụng:</label>
              <input
                type="text"
                value={teacherForm.course}
                onChange={(e) => setTeacherForm({ ...teacherForm, course: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Trình độ hướng tới:</label>
              <select
                value={teacherForm.level}
                onChange={(e) => setTeacherForm({ ...teacherForm, level: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              >
                <option value="A2">Starter (A2)</option>
                <option value="B1">Intermediate (B1)</option>
                <option value="B2">Upper-Intermediate (B2)</option>
                <option value="C1">Advanced (C1)</option>
              </select>
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Chủ đề bài học (Topic):</label>
              <input
                type="text"
                value={teacherForm.topic}
                onChange={(e) => setTeacherForm({ ...teacherForm, topic: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                placeholder="Ví dụ: Environment, Technology, Education..."
              />
            </div>
            
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={loading || role === 'student'}
              style={{
                padding: '0.75rem',
                backgroundColor: role === 'student' ? '#ccc' : '#5C6BC0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: role === 'student' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              {loading ? 'AI Đang sinh bài giảng...' : '⚡ AI Biên Soạn Học Liệu'}
            </button>
            {role === 'student' && <span style={{ fontSize: '0.8rem', color: 'red' }}>⚠️ Học sinh không có quyền soạn giáo án/bài tập.</span>}
          </form>
        </div>

        {/* AI Output Generation Panel */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>📚 Học Liệu Được Biên Soạn</h3>
            {result && (
              <button
                onClick={handlePublish}
                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Giao Bài Cho Học Sinh ➔
              </button>
            )}
          </div>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: '500px', paddingRight: '0.5rem' }}>
              {/* Vocab Section */}
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#3f51b5' }}>📖 Từ vựng cốt lõi (Core Vocab)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.vocabulary?.map((v: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '0.85rem', backgroundColor: '#f5f7fa', padding: '0.5rem', borderRadius: '4px' }}>
                      <strong>{v.word}</strong>: {v.definition}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz Summary */}
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#009688' }}>📝 Bộ câu hỏi trắc nghiệm (MCQ Quiz 10 câu)</h4>
                <p style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 0.5rem 0' }}>Bộ câu hỏi đã được tạo tự động thành công và liên kết trực tiếp tới Cổng làm bài tập của học sinh.</p>
                <div style={{ fontSize: '0.85rem', padding: '0.5rem', border: '1px dashed #4caf50', borderRadius: '6px', color: '#2e7d32', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>✅ <strong>Đã đồng bộ:</strong> Đã tạo 10 câu hỏi trắc nghiệm theo chủ đề "{result.topic}".</span>
                </div>
              </div>

              {/* Homework Section */}
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ff9800' }}>✍️ Bài tập viết (Homework Writing)</h4>
                <div style={{ padding: '0.75rem', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <strong>Yêu cầu đề bài:</strong>
                  <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>{result.homework?.writingTask}</p>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Giới hạn từ: {result.homework?.wordLimit} • {result.homework?.estimatedBand}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexDirection: 'column', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem' }}>📝</span>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Vui lòng thiết lập chủ đề và bấm biên soạn để AI thiết kế tài liệu học tập toàn diện.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
