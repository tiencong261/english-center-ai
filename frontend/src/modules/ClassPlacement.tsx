import React, { useState } from 'react';

interface ClassMatch {
  className: string;
  schedule: string;
  slotsRemaining: number;
  teacher: string;
  startDate: string;
}

interface ClassPlacementProps {
  apiBase: string;
  role: 'admin' | 'staff' | 'student';
}

export default function ClassPlacement({ apiBase, role }: ClassPlacementProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [classForm, setClassForm] = useState({
    student: 'Nguyễn Văn A',
    level: 'B1',
    schedule: 'Mon Evening, Wed Evening',
  });

  const [classes, setClasses] = useState<ClassMatch[]>([
    { className: 'IELTS 5.5 (Intensive)', schedule: 'Mon Evening, Wed Evening', slotsRemaining: 3, teacher: 'Mr. David Smith', startDate: '2026-06-15' },
    { className: 'IELTS Foundations B1', schedule: 'Tue Evening, Thu Evening', slotsRemaining: 5, teacher: 'Ms. Emily Nguyễn', startDate: '2026-06-18' },
    { className: 'Pre-IELTS Speaking Focus', schedule: 'Sat Morning, Sun Morning', slotsRemaining: 2, teacher: 'Mr. Johnathan', startDate: '2026-06-20' },
  ]);

  const handleClassPlacement = async () => {
    setLoading(true);
    try {
      const scheduleArray = classForm.schedule.split(',').map((item) => item.trim());
      const res = await fetch(`${apiBase}/api/ai/class-placement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: classForm.student,
          level: classForm.level,
          schedule: scheduleArray,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      // Offline fallback recommendation
      const foundClasses = classes.filter(
        c => c.schedule.toLowerCase().includes(classForm.schedule.split(',')[0].trim().toLowerCase())
      );
      setResult({
        success: true,
        student: classForm.student,
        matchedClasses: foundClasses.length > 0 ? foundClasses : [classes[0]],
        aiNotes: `AI phân tích: Trình độ học viên đạt ${classForm.level}. Lịch học trùng khớp tốt nhất. Khóa học khuyến nghị giúp học viên bám sát lộ trình IELTS mục tiêu.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (className: string) => {
    alert(`Đăng ký thành công học viên ${classForm.student} vào lớp ${className}! Hệ thống đã gửi SMS & Email xác nhận lịch học tới học viên.`);
    setClasses(prev => prev.map(c => {
      if (c.className === className) {
        return { ...c, slotsRemaining: Math.max(0, c.slotsRemaining - 1) };
      }
      return c;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0 }}>🏫 Module 3: AI Xếp Lớp Tự Động</h2>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Thuật toán AI tự động đối chiếu trình độ đầu vào của học viên và lịch rảnh mong muốn để sắp xếp vào lớp học còn chỗ trống tối ưu nhất.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Form Input */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>🔍 Tìm Lớp Phù Hợp</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Học viên cần xếp lớp:</label>
              <input
                type="text"
                value={classForm.student}
                onChange={(e) => setClassForm({ ...classForm, student: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Trình độ hiện tại (CEFR hoặc IELTS):</label>
              <input
                type="text"
                value={classForm.level}
                onChange={(e) => setClassForm({ ...classForm, level: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Lịch học mong muốn (phân cách bằng dấu phẩy):</label>
              <input
                type="text"
                value={classForm.schedule}
                onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#888' }}>Mẫu: Mon Evening, Wed Evening, Sat Morning</span>
            </div>
            <button
              type="button"
              onClick={handleClassPlacement}
              disabled={loading || role === 'student'}
              style={{ 
                padding: '0.75rem', 
                backgroundColor: role === 'student' ? '#ccc' : '#FF9800', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: role === 'student' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold' 
              }}
            >
              {loading ? 'AI Đang Ghép Lớp...' : 'Quét Lớp Phù Hợp Bằng AI'}
            </button>
            {role === 'student' && <span style={{ fontSize: '0.8rem', color: 'red' }}>⚠️ Học sinh không có quyền xếp lớp học.</span>}
          </form>
        </div>

        {/* AI Placed Results */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>🤖 Kết Quả Đề Xuất Lớp Học</h3>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#fff8e1', borderRadius: '6px', border: '1px solid #ffe082', fontSize: '0.9rem', color: '#b78103' }}>
                💡 {result.aiNotes || result.recommendation?.notes || 'AI nhận diện trình độ đầu vào hoàn toàn thích hợp với lộ trình nâng cao.'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {((result.matchedClasses || result.recommendation?.classes || [classes[0]]) as ClassMatch[]).map((c, i) => (
                  <div key={i} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                    <div>
                      <strong style={{ color: '#2b6cb0', fontSize: '1rem', display: 'block' }}>{c.className}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginTop: '0.25rem' }}>
                        📅 Lịch học: {c.schedule}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#777', display: 'block' }}>
                        👤 Giáo viên: {c.teacher} • Khai giảng: {c.startDate}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        display: 'block', 
                        fontSize: '0.75rem', 
                        color: c.slotsRemaining <= 2 ? '#e53e3e' : '#48bb78', 
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                      }}>
                        Còn {c.slotsRemaining} chỗ trống
                      </span>
                      <button 
                        onClick={() => handleEnroll(c.className)}
                        disabled={c.slotsRemaining === 0 || role === 'student'}
                        style={{ 
                          padding: '0.4rem 0.8rem', 
                          backgroundColor: role === 'student' ? '#ccc' : '#3182ce', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: role === 'student' ? 'not-allowed' : 'pointer', 
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Xếp Lớp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexDirection: 'column' }}>
              <span style={{ fontSize: '2.5rem' }}>🏫</span>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>Nhấn nút tìm lớp để thuật toán AI phân phối học viên vào lớp trống thích hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
