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

interface FeedbackFormProps {
  apiBase: string
}

export default function FeedbackForm({ apiBase }: FeedbackFormProps) {
  const { token, user } = useAuth()
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useAI, setUseAI] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    comment: '',
    strengths: '',
    areasForImprovement: '',
    suggestions: '',
    score: '',
  })

  // Load all submissions (for staff)
  useEffect(() => {
    const loadSubmissions = async () => {
      if (!token || user?.role !== 'staff') return

      setIsLoading(true)
      try {
        const response = await fetch(`${apiBase}/api/submissions?limit=100`, {
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
  }, [token, user])

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubmission || !token) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `${apiBase}/api/submissions/${selectedSubmission.id}/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...feedbackForm,
            score: feedbackForm.score ? parseFloat(feedbackForm.score) : null,
            useAI,
          }),
        }
      )

      if (response.ok) {
        alert('Nhận xét đã gửi thành công!')
        setFeedbackForm({
          comment: '',
          strengths: '',
          areasForImprovement: '',
          suggestions: '',
          score: '',
        })
        setSelectedSubmission(null)

        // Reload submissions
        const reloadResponse = await fetch(`${apiBase}/api/submissions?limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (reloadResponse.ok) {
          const data = await reloadResponse.json()
          setSubmissions(data.submissions)
        }
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      alert('Lỗi khi gửi nhận xét')
    } finally {
      setIsLoading(false)
    }
  }

  if (user?.role !== 'staff' && user?.role !== 'admin') {
    return <div>Chỉ nhân viên có thể truy cập tính năng này.</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2>📊 Chấm điểm & Nhận xét Bài Tập</h2>

      {!selectedSubmission ? (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Danh sách bài tập chờ chấm</h3>
            {isLoading && <div>Đang tải...</div>}
            {submissions.length === 0 && !isLoading && (
              <div style={{ color: '#718096' }}>Không có bài tập nào</div>
            )}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border:
                      submission.feedback.length > 0 ? '1px solid #d1f2eb' : '1px solid #fed7d7',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>
                        {submission.title}
                      </h4>
                      <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                        👤 {submission.student.fullName} | Loại: {submission.submissionType}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor:
                          submission.feedback.length > 0 ? '#d1f2eb' : '#fee2e2',
                        borderRadius: '0.25rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: submission.feedback.length > 0 ? '#0f766e' : '#991b1b',
                      }}
                    >
                      {submission.feedback.length > 0 ? '✅ Đã chấm' : '⏳ Chờ chấm'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
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

          <h3>📝 {selectedSubmission.title}</h3>
          <p style={{ color: '#718096' }}>
            👤 Học viên: {selectedSubmission.student.fullName}
          </p>

          <div
            style={{
              backgroundColor: '#f7fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #e2e8f0',
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <strong>Nội dung bài tập:</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>{selectedSubmission.content}</p>
          </div>

          <form onSubmit={handleSubmitFeedback} style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Điểm (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={feedbackForm.score}
                onChange={(e) =>
                  setFeedbackForm({ ...feedbackForm, score: e.target.value })
                }
                placeholder="Nhập điểm..."
                style={{
                  width: '100px',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <label style={{ fontWeight: '600' }}>Sử dụng AI để tạo nhận xét</label>
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>
                💡 AI sẽ tự động phân tích bài tập và đưa ra nhận xét chi tiết
              </p>
            </div>

            {!useAI && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Nhận xét chung
                  </label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, comment: e.target.value })
                    }
                    placeholder="Nhập nhận xét..."
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    ✅ Điểm mạnh
                  </label>
                  <textarea
                    value={feedbackForm.strengths}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, strengths: e.target.value })
                    }
                    placeholder="Các điểm mạnh của bài tập..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    ⚠️ Cần cải thiện
                  </label>
                  <textarea
                    value={feedbackForm.areasForImprovement}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        areasForImprovement: e.target.value,
                      })
                    }
                    placeholder="Các khía cạnh cần cải thiện..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    💡 Đề xuất
                  </label>
                  <textarea
                    value={feedbackForm.suggestions}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, suggestions: e.target.value })
                    }
                    placeholder="Những gợi ý để học viên cải thiện..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </>
            )}

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
              {isLoading ? 'Đang gửi...' : '✉️ Gửi Nhận xét'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
