import { useState } from 'react';
import './App.css';

// Import Components and Modules
import Dashboard from './components/Dashboard';
import LeadCRM from './modules/LeadCRM';
import AIChat from './modules/AIChat';
import ClassPlacement from './modules/ClassPlacement';
import Attendance from './modules/Attendance';
import AcademicReport from './modules/AcademicReport';
import ParentPortal from './modules/ParentPortal';
import TeacherAssistant from './modules/TeacherAssistant';
import StudentPortal from './modules/StudentPortal';
import ClassRecommendation from './modules/ClassRecommendation';
import BillingInvoice from './modules/BillingInvoice';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type SystemRole = 'admin' | 'staff' | 'student';

export default function App() {
  const [role, setRole] = useState<SystemRole>('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [syncedQuiz, setSyncedQuiz] = useState<any>(null);

  const handleRoleChange = (newRole: SystemRole) => {
    setRole(newRole);
    setActiveTab('dashboard'); // reset to dashboard on role change
  };

  const tabsConfig = [
    { id: 'dashboard', label: '📊 Dashboard', roles: ['admin', 'staff', 'student'] },
    { id: 'leads', label: '🎯 Module 1: Lead CRM', roles: ['admin', 'staff'] },
    { id: 'chat', label: '💬 Module 2: AI Chat Tư Vấn', roles: ['admin', 'staff'] },
    { id: 'class', label: '🏫 Module 3: AI Xếp Lớp', roles: ['admin', 'staff'] },
    { id: 'attendance', label: '📅 Module 4: AI Attendance', roles: ['admin', 'staff'] },
    { id: 'academic', label: '📈 Module 5: Academic Assistant', roles: ['admin', 'staff'] },
    { id: 'teacher', label: '👩‍🏫 Module 6: Teacher Assistant', roles: ['admin', 'staff'] },
    { id: 'student-portal', label: '📝 Cổng Học Sinh (Làm Bài)', roles: ['admin', 'student'] },
    { id: 'parent', label: '👨‍👩‍👦 Module 7: Parent Portal', roles: ['admin', 'student'] },
    { id: 'recommendation', label: '🎯 Module 8: Recommendation', roles: ['admin', 'staff'] },
    { id: 'invoice', label: '💰 Module 9: Billing', roles: ['admin'] },
  ];

  // Filter tabs that are allowed for the current active role
  const visibleTabs = tabsConfig.filter((t) => t.roles.includes(role));

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Universal Header with Role Switching */}
      <header style={{
        padding: '1rem 2rem',
        backgroundColor: '#0f172a',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '4px solid #aa3bff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>🎓</span>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.4rem', letterSpacing: 'normal' }}>English Center AI Portal</h1>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Hệ thống quản trị trung tâm & Trợ lý học tập thông minh</span>
          </div>
        </div>

        {/* Role Selector Panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>👤 VAI TRÒ HỆ THỐNG:</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleRoleChange('admin')}
              style={{
                padding: '0.35rem 0.75rem',
                backgroundColor: role === 'admin' ? '#aa3bff' : 'transparent',
                color: 'white',
                border: role === 'admin' ? 'none' : '1px solid #475569',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleRoleChange('staff')}
              style={{
                padding: '0.35rem 0.75rem',
                backgroundColor: role === 'staff' ? '#2196F3' : 'transparent',
                color: 'white',
                border: role === 'staff' ? 'none' : '1px solid #475569',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}
            >
              👨‍💼 Staff (Nhân Viên)
            </button>
            <button
              onClick={() => handleRoleChange('student')}
              style={{
                padding: '0.35rem 0.75rem',
                backgroundColor: role === 'student' ? '#4CAF50' : 'transparent',
                color: 'white',
                border: role === 'student' ? 'none' : '1px solid #475569',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}
            >
              🎒 Học Viên
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Left Sidebar Navigation */}
        <nav style={{
          width: '260px',
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: '0.5rem', marginBottom: '0.5rem', display: 'block', textAlign: 'left' }}>
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
                color: activeTab === tab.id ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
          <div style={{ marginTop: 'auto', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '6px', fontSize: '0.75rem', color: '#64748b', textAlign: 'left' }}>
            💡 <strong>Hệ Thống Phân Quyền:</strong><br />
            - Admin: Xem & làm tất cả.<br />
            - Staff: Soạn giáo án, CRM, xếp lớp, điểm danh, thống kê điểm.<br />
            - Học viên: Làm bài thi, tra cứu kết quả & nhận xét phụ huynh.
          </div>
        </nav>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f8fafc', overflowY: 'auto', maxHeight: 'calc(100vh - 76px)' }}>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            
            {activeTab === 'dashboard' && (
              <Dashboard role={role} onSwitchTab={(tabId) => setActiveTab(tabId)} />
            )}

            {activeTab === 'leads' && (
              <LeadCRM apiBase={API_BASE} role={role} />
            )}

            {activeTab === 'chat' && (
              <AIChat apiBase={API_BASE} />
            )}

            {activeTab === 'class' && (
              <ClassPlacement apiBase={API_BASE} role={role} />
            )}

            {activeTab === 'attendance' && (
              <Attendance apiBase={API_BASE} role={role} />
            )}

            {activeTab === 'academic' && (
              <AcademicReport apiBase={API_BASE} role={role} />
            )}

            {activeTab === 'teacher' && (
              <TeacherAssistant 
                apiBase={API_BASE} 
                role={role} 
                onSyncQuiz={(quiz) => {
                  setSyncedQuiz(quiz);
                  console.log("Homework synced to student portal:", quiz);
                }} 
              />
            )}

            {activeTab === 'student-portal' && (
              <StudentPortal role={role} syncedQuiz={syncedQuiz} />
            )}

            {activeTab === 'parent' && (
              <ParentPortal apiBase={API_BASE} />
            )}

            {activeTab === 'recommendation' && (
              <ClassRecommendation apiBase={API_BASE} />
            )}

            {activeTab === 'invoice' && (
              <BillingInvoice apiBase={API_BASE} role={role} />
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
