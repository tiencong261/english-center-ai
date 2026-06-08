import { useState, useEffect } from 'react'
import './App.css'

// Import Auth
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/AuthPage'

// Import Components and Modules
import Dashboard from './components/Dashboard'
import LeadCRM from './modules/LeadCRM'
import AIChat from './modules/AIChat'
import ClassPlacement from './modules/ClassPlacement'
import Attendance from './modules/Attendance'
import AcademicReport from './modules/AcademicReport'
import ParentPortal from './modules/ParentPortal'
import TeacherAssistant from './modules/TeacherAssistant'
import StudentPortal from './modules/StudentPortal'
import ClassRecommendation from './modules/ClassRecommendation'
import BillingInvoice from './modules/BillingInvoice'
import StudentSubmissions from './modules/StudentSubmissions'
import Messaging from './modules/Messaging'
import FeedbackForm from './modules/FeedbackForm'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type SystemRole = 'admin' | 'staff' | 'student'

function MainApp() {
  const { user, token, logout, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [syncedQuiz, setSyncedQuiz] = useState<any>(null)

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Đang tải...</div>
      </div>
    )
  }

  if (!token || !user) {
    return <AuthPage onLoginSuccess={() => setActiveTab('dashboard')} />
  }

  const role = (user.role || 'student') as SystemRole

  const tabsConfig = [
    { id: 'dashboard', label: '📊 Dashboard', roles: ['admin', 'staff', 'student'] },
    { id: 'leads', label: '🎯 Lead CRM', roles: ['admin', 'staff'] },
    { id: 'chat', label: '💬 AI Chat Tư Vấn', roles: ['admin', 'staff'] },
    { id: 'class', label: '🏫 AI Xếp Lớp', roles: ['admin', 'staff'] },
    { id: 'attendance', label: '📅 AI Attendance', roles: ['admin', 'staff'] },
    { id: 'academic', label: '📈 Academic Assistant', roles: ['admin', 'staff'] },
    { id: 'teacher', label: '👩‍🏫 Teacher Assistant', roles: ['admin', 'staff'] },
    { id: 'submissions', label: '📝 Bài Tập Của Tôi', roles: ['student'] },
    { id: 'feedback', label: '📊 Chấm Điểm & Nhận Xét', roles: ['staff', 'admin'] },
    { id: 'messaging', label: '💬 Tin Nhắn', roles: ['admin', 'staff', 'student'] },
    { id: 'parent', label: '👨‍👩‍👦 Parent Portal', roles: ['admin', 'student'] },
    { id: 'recommendation', label: '🎯 Recommendation', roles: ['admin', 'staff'] },
    { id: 'invoice', label: '💰 Billing', roles: ['admin'] },
  ]

  // Filter tabs that are allowed for the current active role
  const visibleTabs = tabsConfig.filter((t) => t.roles.includes(role))

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Universal Header with User Info and Logout */}
      <header
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#0f172a',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '4px solid #667eea',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>🎓</span>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.4rem' }}>English Center AI</h1>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Hệ thống quản lý trung tâm tiếng Anh thông minh</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              backgroundColor: '#1e293b',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              textAlign: 'right',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{user.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>👤 {role.toUpperCase()}</div>
          </div>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            🚪 Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar Navigation */}
        <nav
          style={{
            width: '260px',
            backgroundColor: '#1e293b',
            borderRight: '1px solid #334155',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            overflowY: 'auto',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              paddingLeft: '0.5rem',
              marginBottom: '0.5rem',
              display: 'block',
              textAlign: 'left',
            }}
          >
            Menu ({role.toUpperCase()})
          </span>
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === tab.id ? '#334155' : 'transparent',
                color: activeTab === tab.id ? '#667eea' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Body */}
        <main
          style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: '#f8fafc',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 76px)',
          }}
        >
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            {activeTab === 'dashboard' && <Dashboard role={role} onSwitchTab={(tabId) => setActiveTab(tabId)} />}

            {activeTab === 'leads' && <LeadCRM apiBase={API_BASE} role={role} />}

            {activeTab === 'chat' && <AIChat apiBase={API_BASE} />}

            {activeTab === 'class' && <ClassPlacement apiBase={API_BASE} role={role} />}

            {activeTab === 'attendance' && <Attendance apiBase={API_BASE} role={role} />}

            {activeTab === 'academic' && <AcademicReport apiBase={API_BASE} role={role} />}

            {activeTab === 'teacher' && (
              <TeacherAssistant
                apiBase={API_BASE}
                role={role}
                onSyncQuiz={(quiz) => {
                  setSyncedQuiz(quiz)
                  console.log('Homework synced to student portal:', quiz)
                }}
              />
            )}

            {activeTab === 'submissions' && <StudentSubmissions apiBase={API_BASE} />}

            {activeTab === 'feedback' && <FeedbackForm apiBase={API_BASE} />}

            {activeTab === 'messaging' && <Messaging apiBase={API_BASE} />}

            {activeTab === 'parent' && <ParentPortal apiBase={API_BASE} />}

            {activeTab === 'recommendation' && <ClassRecommendation apiBase={API_BASE} />}

            {activeTab === 'invoice' && <BillingInvoice apiBase={API_BASE} role={role} />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
