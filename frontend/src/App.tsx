import { useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function App() {
  const [activeTab, setActiveTab] = useState('leads')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [leadForm, setLeadForm] = useState({
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    intent: 'IELTS',
    target: '6.5',
  })

  const [chatForm, setChatForm] = useState({
    message: 'Học IELTS 6.5 mất bao lâu?',
    level: 'B1',
  })

  const [classForm, setClassForm] = useState({
    student: 'Nguyễn Văn A',
    level: 'B1',
    schedule: ['Mon Evening', 'Wed Evening'],
  })

  const [attendanceForm, setAttendanceForm] = useState({
    studentName: 'Nguyễn Văn A',
    course: 'IELTS 5.5',
    absent: true,
  })

  const [academicForm, setAcademicForm] = useState({
    studentName: 'Nguyễn Văn A',
    month: '2026-06',
  })

  const [parentForm, setParentForm] = useState({
    studentName: 'Nguyễn Văn A',
    month: '2026-06',
  })

  const [teacherForm, setTeacherForm] = useState({
    studentName: 'Nguyễn Văn A',
    course: 'IELTS 6.0',
    level: 'B1',
    topic: 'Speaking practice',
  })

  const [recommendationForm, setRecommendationForm] = useState({
    studentName: 'Nguyễn Văn A',
    level: 'B1',
    goals: 'IELTS 6.5 trong 6 tháng',
    preferredSchedule: 'Mon Evening, Wed Evening',
  })

  const [invoiceForm, setInvoiceForm] = useState({
    studentName: 'Nguyễn Văn A',
    course: 'IELTS 6.0',
    amount: 3500000,
    dueDate: '2026-06-15',
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
        body: JSON.stringify({ message: chatForm.message, context: { level: chatForm.level } }),
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

  const handleAcademicReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/ai/academic-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(academicForm),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleParentPortal = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/parent-portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parentForm),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleTeacherAssistant = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/ai/teacher-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherForm),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleClassRecommendation = async () => {
    setLoading(true)
    try {
      const payload = {
        ...recommendationForm,
        preferredSchedule: recommendationForm.preferredSchedule.split(',').map((item) => item.trim()),
      }
      const res = await fetch(`${API_BASE}/api/ai/class-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleInvoice = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/payments/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceForm),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'leads', label: 'Module 1: Lead CRM' },
    { id: 'chat', label: 'Module 2: AI Chat' },
    { id: 'class', label: 'Module 3: Class Placement' },
    { id: 'attendance', label: 'Module 4: Attendance' },
    { id: 'academic', label: 'Module 5: Academic Report' },
    { id: 'parent', label: 'Module 6: Parent Portal' },
    { id: 'teacher', label: 'Module 7: Teacher Assistant' },
    { id: 'recommendation', label: 'Module 8: Class Recommendation' },
    { id: 'invoice', label: 'Module 9: Billing' },
  ]

  return (
    <div className="app">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>🎓 English Center AI</h1>
        <p>Version 3: CRM + AI Chat + Attendance + Reports + Teacher Assistant + Billing</p>
      </header>

      <div className="tabs" style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null) }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === tab.id ? '#4CAF50' : '#ddd',
              color: activeTab === tab.id ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem', backgroundColor: '#f6f7f9', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
        {activeTab === 'leads' && (
          <div>
            <h2>Module 1: Lead CRM</h2>
            <p>Nhập lead để AI tự động gợi ý mức độ và doanh thu.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên:</label>
                <input
                  type="text"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Muốn học:</label>
                <input
                  type="text"
                  value={leadForm.intent}
                  onChange={(e) => setLeadForm({ ...leadForm, intent: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Mục tiêu điểm:</label>
                <input
                  type="text"
                  value={leadForm.target}
                  onChange={(e) => setLeadForm({ ...leadForm, target: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleCreateLead}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Tạo Lead'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <h2>Module 2: AI Chat Tư Vấn</h2>
            <p>Gửi câu hỏi tư vấn nhanh cho học viên.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tin nhắn:</label>
                <textarea
                  value={chatForm.message}
                  onChange={(e) => setChatForm({ ...chatForm, message: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px' }}
                />
              </div>
              <div>
                <label>Trình độ hiện tại:</label>
                <input
                  type="text"
                  value={chatForm.level}
                  onChange={(e) => setChatForm({ ...chatForm, level: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleChat}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Gửi Tin Nhắn'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'class' && (
          <div>
            <h2>Module 3: AI Xếp Lớp</h2>
            <p>Tìm lớp phù hợp theo trình độ và lịch học.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Học viên:</label>
                <input
                  type="text"
                  value={classForm.student}
                  onChange={(e) => setClassForm({ ...classForm, student: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Trình độ:</label>
                <input
                  type="text"
                  value={classForm.level}
                  onChange={(e) => setClassForm({ ...classForm, level: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Lịch mong muốn:</label>
                <input
                  type="text"
                  value={classForm.schedule.join(', ')}
                  onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value.split(',').map((item) => item.trim()) })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleClassPlacement}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Tìm Lớp'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2>Module 4: AI Attendance</h2>
            <p>Ghi nhận vắng và gửi thông báo tới phụ huynh.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên học viên:</label>
                <input
                  type="text"
                  value={attendanceForm.studentName}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Khóa học:</label>
                <input
                  type="text"
                  value={attendanceForm.course}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, course: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={attendanceForm.absent}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, absent: e.target.checked })}
                />
                Học viên vắng
              </label>
              <button
                type="button"
                onClick={handleAttendance}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Ghi Nhận Vắng & Gửi Thông Báo'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'academic' && (
          <div>
            <h2>Module 5: AI Academic Report</h2>
            <p>Sinh báo cáo học tập tự động dựa trên attendance và course data.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên học viên:</label>
                <input
                  type="text"
                  value={academicForm.studentName}
                  onChange={(e) => setAcademicForm({ ...academicForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Tháng:</label>
                <input
                  type="month"
                  value={academicForm.month}
                  onChange={(e) => setAcademicForm({ ...academicForm, month: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleAcademicReport}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#673AB7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Tạo Báo Cáo'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'parent' && (
          <div>
            <h2>Module 6: Parent Portal</h2>
            <p>Xem tóm tắt hiệu suất học tập và feedback cho phụ huynh.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên học viên:</label>
                <input
                  type="text"
                  value={parentForm.studentName}
                  onChange={(e) => setParentForm({ ...parentForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Tháng:</label>
                <input
                  type="month"
                  value={parentForm.month}
                  onChange={(e) => setParentForm({ ...parentForm, month: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleParentPortal}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#009688', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Xem Cổng Phụ Huynh'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'teacher' && (
          <div>
            <h2>Module 7: AI Teacher Assistant</h2>
            <p>Generate vocabulary, homework and quiz content for the class.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên học viên:</label>
                <input
                  type="text"
                  value={teacherForm.studentName}
                  onChange={(e) => setTeacherForm({ ...teacherForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Khóa học:</label>
                <input
                  type="text"
                  value={teacherForm.course}
                  onChange={(e) => setTeacherForm({ ...teacherForm, course: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Trình độ:</label>
                <input
                  type="text"
                  value={teacherForm.level}
                  onChange={(e) => setTeacherForm({ ...teacherForm, level: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Chủ đề bài học:</label>
                <input
                  type="text"
                  value={teacherForm.topic}
                  onChange={(e) => setTeacherForm({ ...teacherForm, topic: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleTeacherAssistant}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#5C6BC0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Sinh Kế Hoạch Giảng Dạy'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'recommendation' && (
          <div>
            <h2>Module 8: Class Recommendation</h2>
            <p>Advanced class recommendation logic based on goals and schedule.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên học viên:</label>
                <input
                  type="text"
                  value={recommendationForm.studentName}
                  onChange={(e) => setRecommendationForm({ ...recommendationForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Trình độ hiện tại:</label>
                <input
                  type="text"
                  value={recommendationForm.level}
                  onChange={(e) => setRecommendationForm({ ...recommendationForm, level: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Mục tiêu học tập:</label>
                <input
                  type="text"
                  value={recommendationForm.goals}
                  onChange={(e) => setRecommendationForm({ ...recommendationForm, goals: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Lịch mong muốn (phân cách bằng dấu phẩy):</label>
                <input
                  type="text"
                  value={recommendationForm.preferredSchedule}
                  onChange={(e) => setRecommendationForm({ ...recommendationForm, preferredSchedule: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleClassRecommendation}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#00ACC1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Gợi ý Lớp Học'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'invoice' && (
          <div>
            <h2>Module 9: Billing</h2>
            <p>Generate payment invoices and mock payment links.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Tên học viên:</label>
                <input
                  type="text"
                  value={invoiceForm.studentName}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, studentName: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Khóa học:</label>
                <input
                  type="text"
                  value={invoiceForm.course}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, course: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Số tiền (VND):</label>
                <input
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label>Ngày đến hạn:</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="button"
                onClick={handleInvoice}
                disabled={loading}
                style={{ padding: '0.9rem', backgroundColor: '#8E24AA', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : 'Tạo Hoá Đơn'}
              </button>
            </form>
          </div>
        )}

        {result && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3>Kết quả:</h3>
            <pre style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '6px', overflow: 'auto', maxHeight: '360px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
