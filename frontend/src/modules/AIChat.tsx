import React, { useState } from 'react';

interface ChatMessage {
  sender: 'user' | 'ai' | 'staff';
  text: string;
  time: string;
}

interface AIChatProps {
  apiBase: string;
}

export default function AIChat({ apiBase }: AIChatProps) {
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [chatForm, setChatForm] = useState({
    message: 'Học IELTS 6.5 mất bao lâu?',
    level: 'B1',
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'user', text: 'Chào trung tâm, mình muốn tư vấn học IELTS', time: '10:00 AM' },
    { sender: 'ai', text: 'Xin chào! Em là AI Tư vấn viên của English Center. Anh/Chị đang có mục tiêu đạt band điểm bao nhiêu và trình độ hiện tại thế nào ạ?', time: '10:00 AM' },
  ]);

  const handleSendMessage = async () => {
    if (!chatForm.message.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: chatForm.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentMessage = chatForm.message;
    setChatForm({ ...chatForm, message: '' });

    if (escalated) {
      // If escalated to human, simulate staff reply after 1s
      setTimeout(() => {
        const staffMsg: ChatMessage = {
          sender: 'staff',
          text: 'Chào anh/chị, tôi là tư vấn viên của trung tâm. Tôi đã tiếp quản cuộc trò chuyện này. Anh/chị muốn đăng ký lịch khai giảng ngày nào ạ?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, staffMsg]);
      }, 1000);
      return;
    }

    // Call AI endpoint
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentMessage, context: { level: chatForm.level } }),
      });
      const data = await res.json();
      
      const aiResponse = data.escalate 
        ? "Xin lỗi anh/chị, câu hỏi chuyên sâu này em chưa chắc chắn. Em đang chuyển cuộc gọi cho nhân viên tư vấn trực tiếp hỗ trợ ngay ạ!"
        : (data.reply || "Dạ, anh/chị cần tư vấn thêm thông tin gì ạ?");

      if (data.escalate) {
        setEscalated(true);
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Fallback response
      let fallbackText = "Nếu hiện tại trình độ khoảng B1, thường cần 4-6 tháng học tập trung. Anh/chị muốn em tư vấn khóa online hay học trực tiếp ạ?";
      if (currentMessage.toLowerCase().includes('học phí') || currentMessage.toLowerCase().includes('giảm giá')) {
        fallbackText = "Dạ, về các chương trình ưu đãi học phí đặc biệt, em xin phép chuyển cho tư vấn viên để báo giá chính xác nhất ạ!";
        setEscalated(true);
      }
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: fallbackText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestClick = (msg: string) => {
    setChatForm({ ...chatForm, message: msg });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0 }}>💬 Module 2: AI Chat Tư Vấn Khách Hàng</h2>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>AI tự động trả lời tư vấn lộ trình học. Nếu phát hiện ý định phức tạp hoặc không chắc chắn, AI tự động chuyển cho nhân viên thật (Human Agent).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Chat Window */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eef0f5', display: 'flex', flexDirection: 'column', height: '480px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          {/* Chat Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🤖</span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>AI Assistant & Support</strong>
                <span style={{ fontSize: '0.75rem', color: escalated ? '#f44336' : '#4caf50' }}>
                  ● {escalated ? 'Đã chuyển cho Nhân Viên Thật' : 'AI đang tự động trả lời'}
                </span>
              </div>
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={escalated} 
                onChange={(e) => setEscalated(e.target.checked)} 
              />
              Gặp Nhân Viên
            </label>
          </div>

          {/* Messages Container */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#f5f7fb' }}>
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              const isStaff = msg.sender === 'staff';
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '0.15rem', textAlign: isUser ? 'right' : 'left' }}>
                      {isUser ? 'Khách hàng' : isStaff ? '👨‍💼 Tư Vấn Viên' : '🤖 AI SmartBot'} ({msg.time})
                    </span>
                    <div style={{ 
                      padding: '0.65rem 0.9rem', 
                      borderRadius: '12px', 
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      color: isUser ? 'white' : '#222',
                      backgroundColor: isUser ? '#aa3bff' : isStaff ? '#eef2ff' : 'white',
                      border: isUser ? 'none' : isStaff ? '1px solid #c7d2fe' : '1px solid #eef0f5',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>AI đang gõ...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Nhập câu hỏi tư vấn học tập..." 
              value={chatForm.message}
              onChange={(e) => setChatForm({ ...chatForm, message: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
            />
            <button 
              onClick={handleSendMessage}
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#aa3bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Gửi
            </button>
          </div>
        </div>

        {/* Chat Control / Sidebar */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eef0f5', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>💡 Trình Mô Phỏng</h3>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Click các kịch bản mẫu dưới đây để thử nghiệm khả năng của chatbot AI:</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button 
              onClick={() => handleSuggestClick('Học IELTS 6.5 mất bao lâu?')}
              style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fafafa', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ❓ "Học IELTS 6.5 mất bao lâu?"
            </button>
            <button 
              onClick={() => handleSuggestClick('Khóa học giao tiếp giá bao nhiêu?')}
              style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fafafa', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              💰 "Khóa học giao tiếp giá bao nhiêu?" (Kích hoạt chuyển nhân viên)
            </button>
            <button 
              onClick={() => handleSuggestClick('Tối Thứ 2 và Thứ 4 có lớp IELTS 5.5 nào trống không?')}
              style={{ width: '100%', textAlign: 'left', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fafafa', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              🏫 "Lịch học IELTS lớp tối Thứ 2 - 4"
            </button>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <label style={{ fontWeight: '500', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Mô phỏng trình độ đầu vào:</label>
            <select 
              value={chatForm.level}
              onChange={(e) => setChatForm({ ...chatForm, level: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="A2">A2 (Starter/Elementary)</option>
              <option value="B1">B1 (Intermediate)</option>
              <option value="B2">B2 (Upper-Intermediate)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
