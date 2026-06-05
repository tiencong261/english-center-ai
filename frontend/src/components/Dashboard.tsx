import React from 'react';

interface DashboardProps {
  role: 'admin' | 'staff' | 'student';
  onSwitchTab: (tabId: string) => void;
}

export default function Dashboard({ role, onSwitchTab }: DashboardProps) {
  // Stat mocks for Admin and Staff
  const adminStats = [
    { title: 'Tổng Học Viên', value: '524', change: '+12% tháng này', color: '#4CAF50', icon: '👥' },
    { title: 'Giáo Viên', value: '20', change: 'Đang hoạt động', color: '#2196F3', icon: '👩‍🏫' },
    { title: 'Lớp Học', value: '15 Lớp', change: 'Tỷ lệ đầy 88%', color: '#FF9800', icon: '🏫' },
    { title: 'Doanh Thu (Tháng)', value: '315,000,000đ', change: '+18% so với quý trước', color: '#E91E63', icon: '💰' },
    { title: 'Lead Mới', value: '47 Lead', change: '85% từ TikTok/FB', color: '#9C27B0', icon: '🎯' },
    { title: 'Tỷ Lệ Điểm Danh', value: '94.2%', change: 'Khá tốt', color: '#00BCD4', icon: '📅' },
  ];

  const recentLeads = [
    { name: 'Nguyễn Hồng Nhung', phone: '0912xxx888', source: 'Facebook Lead', intent: 'IELTS', level: 'HOT', time: '10 phút trước' },
    { name: 'Trần Minh Quân', phone: '0983xxx112', source: 'TikTok Lead', intent: 'Giao tiếp', level: 'WARM', time: '1 giờ trước' },
    { name: 'Phạm Thu Thảo', phone: '0904xxx555', source: 'Website Registration', intent: 'IELTS', level: 'COLD', time: '3 giờ trước' },
  ];

  const studentInfo = {
    name: 'Nguyễn Văn A',
    level: 'B1 (IELTS 5.0)',
    target: 'IELTS 6.5',
    course: 'IELTS Master Class Intensive',
    progress: 75,
    attendance: '8/8 buổi (100%)',
    recentScore: '8.5/10 (Quiz 4)',
  };

  if (role === 'student') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)', padding: '2rem', borderRadius: '12px', color: 'white', textAlign: 'left', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.75rem' }}>Chào mừng trở lại, {studentInfo.name}! 👋</h2>
          <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Bạn đang học lộ trình <strong>{studentInfo.target}</strong>. Hãy tiếp tục cố gắng nhé!</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Trình độ hiện tại</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{studentInfo.level}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Khóa học hiện tại</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{studentInfo.course}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Chuyên cần</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{studentInfo.attendance}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Điểm kiểm tra gần nhất</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{studentInfo.recentScore}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚡ Lối tắt cho bạn</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => onSwitchTab('student-portal')}
                style={{ width: '100%', padding: '0.9rem', backgroundColor: '#4A00E0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>📝 Làm bài kiểm tra & Luyện tập</span>
                <span>➔</span>
              </button>
              <button 
                onClick={() => onSwitchTab('parent')}
                style={{ width: '100%', padding: '0.9rem', backgroundColor: '#009688', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>👨‍👩‍👦 Xem báo cáo học tập & Parent Portal</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📈 Tiến độ học tập khóa học</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, backgroundColor: '#e0e0e0', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${studentInfo.progress}%`, backgroundColor: '#4CAF50', height: '100%' }}></div>
              </div>
              <span style={{ fontWeight: 'bold' }}>{studentInfo.progress}%</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#555' }}>
              <li>Đã hoàn thành: 12/16 bài học</li>
              <li>Đã nộp bài tập về nhà: 6/6 bài</li>
              <li>Dự kiến kết thúc khóa học: Còn 1 tháng</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Admin & Staff Dashboard View
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>📊 Dashboard Thống Kê {role === 'admin' ? 'Hệ Thống' : 'Nhân Viên'}</h2>
          <p style={{ color: '#666', marginTop: '0.25rem' }}>Theo dõi trực quan dữ liệu marketing, sales, học tập và tài chính thời gian thực.</p>
        </div>
        <span style={{ backgroundColor: role === 'admin' ? '#aa3bff' : '#2196F3', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          Role: {role === 'admin' ? 'Chủ trung tâm (Admin)' : 'Nhân viên (Staff)'}
        </span>
      </div>

      {/* Grid Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {adminStats.map((stat, i) => {
          // If staff, hide the revenue card for better role restriction demonstration, or show it depending on scope
          if (role === 'staff' && stat.title.includes('Doanh Thu')) {
            return (
              <div key={i} style={{ backgroundColor: '#fafafa', padding: '1.25rem', borderRadius: '10px', border: '1.5px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#aaa', fontSize: '0.85rem', textAlign: 'center' }}>🔒 Doanh thu chỉ dành cho Admin</p>
              </div>
            );
          }
          return (
            <div key={i} style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '10px', border: '1px solid #eef0f5', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem', backgroundColor: `${stat.color}15`, padding: '0.5rem', borderRadius: '8px' }}>
                {stat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.85rem', color: '#888', display: 'block' }}>{stat.title}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#222', display: 'block', margin: '0.15rem 0' }}>{stat.value}</span>
                <span style={{ fontSize: '0.75rem', color: '#4CAF50', fontWeight: '500' }}>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {/* Recent Marketing Leads */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eef0f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>🎯 Leads Mới Nhận Hôm Nay</h3>
            <button onClick={() => onSwitchTab('leads')} style={{ background: 'none', border: 'none', color: '#aa3bff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Xem CRM ➔</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentLeads.map((lead, idx) => (
              <div key={idx} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#777' }}>SĐT: {lead.phone} • Nguồn: {lead.source}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: lead.level === 'HOT' ? '#f44336' : lead.level === 'WARM' ? '#ff9800' : '#9e9e9e'
                  }}>
                    {lead.level}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.25rem' }}>{lead.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Statistics */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eef0f5' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📊 Trạng Thái Trung Tâm</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Chỉ tiêu tuyển sinh tháng này (Học viên mới)</span>
                <strong>28 / 40 (70%)</strong>
              </div>
              <div style={{ backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '70%', backgroundColor: '#aa3bff', height: '100%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Tỷ lệ hoàn thành bài tập về nhà</span>
                <strong>89.5%</strong>
              </div>
              <div style={{ backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '89.5%', backgroundColor: '#4CAF50', height: '100%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Phản hồi tích cực từ phụ huynh</span>
                <strong>96.2%</strong>
              </div>
              <div style={{ backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '96.2%', backgroundColor: '#00BCD4', height: '100%' }}></div>
              </div>
            </div>

            {role === 'admin' && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#eef2ff', borderRadius: '6px', fontSize: '0.85rem', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                💡 <strong>Admin Tip:</strong> Chiến dịch quảng cáo TikTok Lead đang mang lại <strong>tỷ lệ chuyển đổi Hot Lead cao nhất (24%)</strong>. Khuyên dùng tăng 15% ngân sách cho tuần tới.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
