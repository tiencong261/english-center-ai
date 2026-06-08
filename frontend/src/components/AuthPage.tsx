import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

interface AuthPageProps {
  onLoginSuccess: () => void
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'student' | 'staff'>('student')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password, fullName, role)
      }
      onLoginSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>🎓</h1>
          <h1>English Center AI</h1>
          <p>Hệ thống quản lý trung tâm tiếng Anh thông minh</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-tabs">
            <button
              type="button"
              className={`tab-button ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              className={`tab-button ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Đăng Ký
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Họ Tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ tên của bạn"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Vai Trò</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'staff')}
              >
                <option value="student">🎒 Học Viên</option>
                <option value="staff">👨‍💼 Nhân Viên</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Mật Khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">📝 Thông tin Demo:</p>
          <div className="demo-account">
            <strong>Admin:</strong> admin@test.com / password123
          </div>
          <div className="demo-account">
            <strong>Giáo Viên:</strong> teacher@test.com / password123
          </div>
          <div className="demo-account">
            <strong>Học Viên:</strong> student@test.com / password123
          </div>
        </div>
      </div>
    </div>
  )
}
