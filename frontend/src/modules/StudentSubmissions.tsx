import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface StudentSubmission {
  id: number
  title: string
  content: string
  submissionType: string
  score?: number
  createdAt: string
  feedback: any[]
  student: {
    id: number
    fullName: string
  }
}

interface StudentSubmissionsProps {
  apiBase: string
}

export default function StudentSubmissions({ apiBase }: StudentSubmissionsProps) {
  const { token, user } = useAuth()
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    submissionType: 'exercise',
  })
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null)

  // Load submissions
  useEffect(() => {
    const loadSubmissions = async () => {
      if (!token) return

      setIsLoading(true)
      try {
        const response = await fetch(`${apiBase}/api/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setSubmissions(data.submissions)
        }
      } catch (error) {
        console.error('Failed to load submissions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSubmissions()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch(`${apiBase}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions([data, ...submissions])
        setFormData({ title: '', content: '', submissionType: 'exercise' })
        setShowForm(false)
        alert('Bài tập đã gửi thành công!')
      }
    } catch (error) {
      console.error('Failed to submit:', error)
      alert('Lỗi khi gửi bài tập')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewSubmission = (submission: StudentSubmission) => {
    setSelectedSubmission(submission)
  }

  if (isLoading && submissions.length === 0) {
    return <div>Đang tải...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>📝 Bài Tập Của Tôi</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          {showForm ? '✕ Đóng' : '✚ Gửi Bài Mới'}
        </button>
      </div>

      {showForm && (
        <div
          style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Tiêu đề bài tập
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề..."
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Nội dung
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập nội dung bài tập..."
                required
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Loại bài tập
              </label>
              <select
                value={formData.submissionType}
                onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                }}
              >
                <option value="exercise">Bài tập</option>
                <option value="homework">Bài tập về nhà</option>
                <option value="essay">Bài luận</option>
                <option value="project">Dự án</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {isLoading ? 'Đang gửi...' : 'Gửi Bài'}
            </button>
          </form>
        </div>
      )}

      {selectedSubmission ? (
        <div
          style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={() => setSelectedSubmission(null)}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#e2e8f0',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            ← Quay lại danh sách
          </button>

          <h3>{selectedSubmission.title}</h3>
          <p style={{ color: '#718096', marginBottom: '1rem' }}>
            Loại: {selectedSubmission.submissionType} | Điểm: {selectedSubmission.score ?? 'Chưa chấm'}
          </p>

          <div
            style={{
              backgroundColor: '#f7fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {selectedSubmission.content}
          </div>

          {selectedSubmission.feedback.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>📝 Nhận xét từ giáo viên</h4>
              {selectedSubmission.feedback.map((fb) => (
                <div
                  key={fb.id}
                  style={{
                    backgroundColor: '#f0f4ff',
                    border: '1px solid #c7d2fe',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#667eea' }}>
                      {fb.user.fullName}
                      {fb.aiGenerated && ' (🤖 AI)'}
                    </strong>
                  </div>
                  <div style={{ marginBottom: '0.75rem', color: '#4a5568' }}>
                    {fb.comment}
                  </div>

                  {fb.strengths && (
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <strong>✅ Điểm mạnh:</strong>
                      <p style={{ margin: '0.25rem 0', color: '#2f855a' }}>
                        {fb.strengths}
                      </p>
                    </div>
                  )}

                  {fb.areasForImprovement && (
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <strong>⚠️ Cần cải thiện:</strong>
                      <p style={{ margin: '0.25rem 0', color: '#9f1239' }}>
                        {fb.areasForImprovement}
                      </p>
                    </div>
                  )}

                  {fb.suggestions && (
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong>💡 Đề xuất:</strong>
                      <p style={{ margin: '0.25rem 0', color: '#7c2d12' }}>
                        {fb.suggestions}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {submissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => handleViewSubmission(submission)}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as any).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')
              }
              onMouseLeave={(e) => ((e.currentTarget as any).style.boxShadow = 'none')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>📄 {submission.title}</h4>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                    Loại: {submission.submissionType} | Gửi:{' '}
                    {new Date(submission.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: submission.feedback.length > 0 ? '#d1f2eb' : '#f3e8ff',
                    borderRadius: '0.25rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: submission.feedback.length > 0 ? '#0f766e' : '#6d28d9',
                  }}
                >
                  {submission.feedback.length > 0
                    ? `✅ Đã nhận xét (${submission.feedback.length})`
                    : '⏳ Đang chờ'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
