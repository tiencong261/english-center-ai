import React, { useState } from 'react';

interface Lead {
  id?: number;
  name: string;
  phone: string;
  intent: string;
  target: string;
  level?: string;
  estimatedRevenue?: number;
  createdAt?: string;
}

interface LeadCRMProps {
  apiBase: string;
  role: 'admin' | 'staff' | 'student';
}

export default function LeadCRM({ apiBase, role }: LeadCRMProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [leadForm, setLeadForm] = useState({
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    intent: 'IELTS',
    target: '6.5',
  });

  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: 'Nguyễn Hồng Nhung', phone: '0912xxx888', intent: 'IELTS', target: '7.0', level: 'HOT', estimatedRevenue: 12000000, createdAt: '2026-06-05' },
    { id: 2, name: 'Trần Minh Quân', phone: '0983xxx112', intent: 'Giao tiếp', target: 'Fluency', level: 'WARM', estimatedRevenue: 6000000, createdAt: '2026-06-05' },
    { id: 3, name: 'Phạm Thu Thảo', phone: '0904xxx555', intent: 'IELTS', target: '5.5', level: 'COLD', estimatedRevenue: 4500000, createdAt: '2026-06-04' },
  ]);

  const handleCreateLead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm),
      });
      const data = await res.json();
      setResult(data);

      if (data.lead) {
        const newLead: Lead = {
          id: data.lead.id || Date.now(),
          name: data.lead.name || leadForm.name,
          phone: data.lead.phone || leadForm.phone,
          intent: data.lead.intent || leadForm.intent,
          target: data.lead.target || leadForm.target,
          level: data.prediction?.level || 'WARM',
          estimatedRevenue: data.prediction?.estimatedRevenue || 8000000,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setLeads((prev) => [newLead, ...prev]);
      }
    } catch (err) {
      setResult({ error: String(err) });
      // Fallback lead on local mock
      const mockLead: Lead = {
        id: Date.now(),
        name: leadForm.name,
        phone: leadForm.phone,
        intent: leadForm.intent,
        target: leadForm.target,
        level: leadForm.target >= '6.5' ? 'HOT' : 'WARM',
        estimatedRevenue: leadForm.target >= '6.5' ? 12000000 : 8000000,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLeads((prev) => [mockLead, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const hotLeads = leads.filter(l => l.level === 'HOT');
  const warmLeads = leads.filter(l => l.level === 'WARM');
  const coldLeads = leads.filter(l => l.level === 'COLD');

  const totalRev = leads.reduce((acc, l) => acc + (l.estimatedRevenue || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0 }}>🎯 Module 1: AI Lead CRM</h2>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Khách để lại thông tin, AI tự động phân tích mức độ ưu tiên (HOT/WARM/COLD), khóa học phù hợp và dự kiến doanh thu.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Lead Form */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📋 Nhập Thông Tin Khách Hàng</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Họ và tên:</label>
              <input
                type="text"
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Số điện thoại:</label>
              <input
                type="text"
                value={leadForm.phone}
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Khóa học quan tâm:</label>
              <input
                type="text"
                value={leadForm.intent}
                onChange={(e) => setLeadForm({ ...leadForm, intent: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Mục tiêu đầu ra (ví dụ 6.5):</label>
              <input
                type="text"
                value={leadForm.target}
                onChange={(e) => setLeadForm({ ...leadForm, target: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="button"
              onClick={handleCreateLead}
              disabled={loading || role === 'student'}
              style={{ 
                padding: '0.75rem', 
                backgroundColor: role === 'student' ? '#ccc' : '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: role === 'student' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold' 
              }}
            >
              {loading ? 'AI Đang Phân Tích...' : 'Tạo Lead & Phân Tích AI'}
            </button>
            {role === 'student' && <span style={{ fontSize: '0.8rem', color: 'red' }}>⚠️ Học sinh không có quyền thêm Lead.</span>}
          </form>
        </div>

        {/* AI Prediction View */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>🤖 Kết Quả Phân Tích AI Gần Nhất</h3>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>Độ HOT:</span>
                <span style={{ 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '4px', 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: result.prediction?.level === 'HOT' ? '#f44336' : result.prediction?.level === 'WARM' ? '#ff9800' : '#9e9e9e'
                }}>
                  {result.prediction?.level || 'WARM'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>Khóa học đề xuất:</span>
                <strong style={{ marginLeft: '0.5rem' }}>{result.prediction?.course || result.lead?.intent || 'Chưa rõ'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>Doanh thu dự kiến:</span>
                <strong style={{ marginLeft: '0.5rem', color: '#e91e63' }}>
                  {(result.prediction?.estimatedRevenue || 0).toLocaleString()}đ
                </strong>
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.25rem' }}>Raw JSON Metadata:</span>
                <pre style={{ backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', overflow: 'auto', maxHeight: '120px', margin: 0 }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center', color: '#999', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>🧠</span>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Nhập lead bên trái để kích hoạt AI phân tích cơ hội bán hàng tự động.</p>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>📊 Pipeline Phân Loại Khách Hàng (Tự động bởi AI)</h3>
          <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            Tổng doanh thu cơ hội: {totalRev.toLocaleString()}đ
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* HOT COLUMN */}
          <div style={{ backgroundColor: '#fff5f5', borderRadius: '8px', padding: '1rem', border: '1px solid #ffe3e3' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#e53e3e', display: 'flex', justifyContent: 'space-between' }}>
              <span>🔥 HOT</span>
              <span>({hotLeads.length})</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {hotLeads.map(l => (
                <div key={l.id} style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #fbd38d', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{l.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{l.phone} • {l.intent} ({l.target})</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#e53e3e', marginTop: '0.25rem' }}>{l.estimatedRevenue?.toLocaleString()}đ</div>
                </div>
              ))}
              {hotLeads.length === 0 && <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>Không có lead HOT</p>}
            </div>
          </div>

          {/* WARM COLUMN */}
          <div style={{ backgroundColor: '#fffaf0', borderRadius: '8px', padding: '1rem', border: '1px solid #feebc8' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#dd6b20', display: 'flex', justifyContent: 'space-between' }}>
              <span>⚡ WARM</span>
              <span>({warmLeads.length})</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {warmLeads.map(l => (
                <div key={l.id} style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{l.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{l.phone} • {l.intent} ({l.target})</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#dd6b20', marginTop: '0.25rem' }}>{l.estimatedRevenue?.toLocaleString()}đ</div>
                </div>
              ))}
              {warmLeads.length === 0 && <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>Không có lead WARM</p>}
            </div>
          </div>

          {/* COLD COLUMN */}
          <div style={{ backgroundColor: '#f7fafc', borderRadius: '8px', padding: '1rem', border: '1px solid #edf2f7' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', color: '#4a5568', display: 'flex', justifyContent: 'space-between' }}>
              <span>❄️ COLD</span>
              <span>({coldLeads.length})</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {coldLeads.map(l => (
                <div key={l.id} style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #edf2f7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{l.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{l.phone} • {l.intent} ({l.target})</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#4a5568', marginTop: '0.25rem' }}>{l.estimatedRevenue?.toLocaleString()}đ</div>
                </div>
              ))}
              {coldLeads.length === 0 && <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>Không có lead COLD</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
