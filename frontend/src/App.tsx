import { useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function App() {
  const [activeTab, setActiveTab] = useState('leads')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    intent: 'IELTS',
    target: '6.5',
  })

  // Chat form state
  const [chatForm, setChatForm] = useState({
    message: 'Học IELTS 6.5 mất bao lâu?',
    level: 'B1',
  })

  // Class placement form state
  const [classForm, setClassForm] = useState({
    student: 'Nguyễn Văn A',
    level: 'B1',
    schedule: ['Mon Evening', 'Wed Evening'],
  })

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    studentName: 'Nguyễn Văn A',
    course: 'IELTS 5.5',
    absent: true,
  })

  const handleCreateLead = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatForm.message,
          context: { level: chatForm.level },
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleClassPlacement = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/ai/class-placement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classForm),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleAttendance = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/ai/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceForm),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>🎓 English Center AI MVP</h1>
        <p>Version 1: CRM + AI Chat + Follow-up</p>
      </header>

      <div className="tabs" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['leads', 'chat', 'class', 'attendance'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setResult(null); }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === tab ? '#4CAF50' : '#ddd',
              color: activeTab === tab ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {tab === 'leads' && 'Module 1: Lead CRM'}
            {tab === 'chat' && 'Module 2: AI Chat'}
            {tab === 'class' && 'Module 3: Class Placement'}
            {tab === 'attendance' && 'Module 4: Attendance'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        {activeTab === 'leads' && (
          <div>
            <h2>Module 1: Lead CRM</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên:</label>
                <input
                  type="text"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label>Muốn học:</label>
                <input
                  type="text"
                  value={leadForm.intent}
                  onChange={(e) => setLeadForm({ ...leadForm, intent: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label>Mục tiêu điểm:</label>
                <input
                  type="text"
                  value={leadForm.target}
                  onChange={(e) => setLeadForm({ ...leadForm, target: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <button
                type="button"
                onClick={handleCreateLead}
                disabled={loading}
                style={{ padding: '0.75rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Tạo Lead'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <h2>Module 2: AI Chat Tư Vấn</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tin nhắn:</label>
                <textarea
                  value={chatForm.message}
                  onChange={(e) => setChatForm({ ...chatForm, message: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
                />
              </div>
              <div>
                <label>Trình độ hiện tại:</label>
                <input
                  type="text"
                  value={chatForm.level}
                  onChange={(e) => setChatForm({ ...chatForm, level: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <button
                type="button"
                onClick={handleChat}
                disabled={loading}
                style={{ padding: '0.75rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Gửi Tin Nhắn'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'class' && (
          <div>
            <h2>Module 3: AI Xếp Lớp</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Học viên:</label>
                <input
                  type="text"
                  value={classForm.student}
                  onChange={(e) => setClassForm({ ...classForm, student: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label>Trình độ:</label>
                <input
                  type="text"
                  value={classForm.level}
                  onChange={(e) => setClassForm({ ...classForm, level: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <button
                type="button"
                onClick={handleClassPlacement}
                disabled={loading}
                style={{ padding: '0.75rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Tìm Lớp'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2>Module 4: AI Attendance</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên học viên:</label>
                <input
                  type="text"
                  value={attendanceForm.studentName}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label>Khóa học:</label>
                <input
                  type="text"
                  value={attendanceForm.course}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, course: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={attendanceForm.absent}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, absent: e.target.checked })}
                  />
                  Học viên vắng
                </label>
              </div>
              <button
                type="button"
                onClick={handleAttendance}
                disabled={loading}
                style={{ padding: '0.75rem', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Ghi Nhận Vắng & Gửi Thông Báo'}
              </button>
            </form>
          </div>
        )}

        {result && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h3>Kết quả:</h3>
            <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '4px', overflow: 'auto', maxHeight: '300px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
