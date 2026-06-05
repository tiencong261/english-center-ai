import React, { useState } from 'react';

interface AcademicReportProps {
  apiBase: string;
  role: 'admin' | 'staff' | 'student';
}

export default function AcademicReport({ apiBase, role }: AcademicReportProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [academicForm, setAcademicForm] = useState({
    studentName: 'Nguyễn Văn A',
    month: '2026-06',
  });

  const handleAcademicReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/ai/academic-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(academicForm),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      // Offline fallback report
      setResult({
        success: true,
        studentName: academicForm.studentName,
        month: academicForm.month,
        attendanceRate: '92.5%',
        vocabularyProgress: 'Khá',
        speakingSkills: 'Cần cải thiện độ trôi chảy và ngữ điệu tự nhiên.',
        gradeHistory: [
          { test: 'Quiz 1', score: '85/100' },
          { test: 'Quiz 2', score: '90/100' },
          { test: 'Midterm writing', score: '7.0/9.0' },
        ],
        aiForecast: {
          predictedIELTS: '6.5',
          durationMonths: 2,
          notes: 'Nếu duy trì được thái độ học tập và chuyên cần hiện tại, học viên tự tin vượt mốc 6.0 và đạt 6.5 trong vòng 2 tháng tới.'
        },
        teacherRecommendation: 'Nên dành thêm 15-20 phút tự luyện ghi âm Speaking hàng ngày theo chủ đề môi trường và xã hội.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0 }}>📊 Module 5: AI Academic Assistant / Báo Cáo Học Tập Tự Động</h2>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Thay vì giáo viên soạn thảo báo cáo tay thủ công tốn hàng giờ, AI tự quét chuyên cần, điểm số, và thái độ học tập để xuất ra phiếu đánh giá chuẩn xác, có kèm dự báo điểm số và lộ trình cải thiện.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Report form */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📝 Sinh Phiếu Đánh Giá Tự Động</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Học viên cần đánh giá:</label>
              <input
                type="text"
                value={academicForm.studentName}
                onChange={(e) => setAcademicForm({ ...academicForm, studentName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Kỳ đánh giá (Tháng):</label>
              <input
                type="month"
                value={academicForm.month}
                onChange={(e) => setAcademicForm({ ...academicForm, month: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="button"
              onClick={handleAcademicReport}
              disabled={loading || role === 'student'}
              style={{ 
                padding: '0.75rem', 
                backgroundColor: role === 'student' ? '#ccc' : '#673AB7', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: role === 'student' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold' 
              }}
            >
              {loading ? 'AI Đang đọc dữ liệu...' : 'Bắt đầu AI Tổng Hợp & Đánh Giá'}
            </button>
            {role === 'student' && <span style={{ fontSize: '0.8rem', color: 'red' }}>⚠️ Học sinh không được tự sinh báo cáo học thuật.</span>}
          </form>
        </div>

        {/* Generated Report Card Visual */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📄 Phiếu Đánh Giá Kết Quả Học Tập (AI-Generated)</h3>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <span>Học viên: <strong>{result.studentName || academicForm.studentName}</strong></span>
                <span>Tháng đánh giá: <strong>{result.month || academicForm.month}</strong></span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#718096', display: 'block' }}>Chuyên cần</span>
                  <strong style={{ fontSize: '1.1rem', color: '#48bb78' }}>{result.attendanceRate || result.report?.attendance || '92.5%'}</strong>
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f7fafc', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#718096', display: 'block' }}>Từ vựng (Vocabulary)</span>
                  <strong style={{ fontSize: '1.1rem', color: '#3182ce' }}>{result.vocabularyProgress || result.report?.vocabulary || 'Khá'}</strong>
                </div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#fffaf0', borderRadius: '6px', borderLeft: '4px solid #dd6b20' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#c05621' }}>Kỹ năng nói (Speaking):</strong>
                <span>{result.speakingSkills || result.report?.speaking || 'Cần cải thiện độ trôi chảy.'}</span>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#ebf8ff', borderRadius: '6px', borderLeft: '4px solid #3182ce' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#2b6cb0' }}>🔮 Dự đoán lộ trình thông minh:</strong>
                <span>Khả năng đạt <strong>IELTS {(result.aiForecast?.predictedIELTS || result.report?.predictedBand || '6.0')}</strong> sau {(result.aiForecast?.durationMonths || 2)} tháng.</span>
                <p style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.25rem', margin: 0 }}>
                  {result.aiForecast?.notes || result.report?.details}
                </p>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#718096', display: 'block' }}>Đề xuất từ AI cho giáo viên:</span>
                <p style={{ margin: '0.25rem 0 0 0', fontStyle: 'italic', color: '#2d3748' }}>
                  "{result.teacherRecommendation || result.report?.teacherNote || 'Nên cho học viên tập nói thêm trước gương 10 phút mỗi ngày.'}"
                </p>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexDirection: 'column' }}>
              <span style={{ fontSize: '2.5rem' }}>📊</span>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>Hệ thống AI Assistant sẵn sàng đồng bộ bảng điểm và nhận xét kết quả học sinh tự động.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
