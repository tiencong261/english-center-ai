import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  isRead: boolean
  createdAt: string
  sender: {
    id: number
    fullName: string
    email: string
  }
  receiver: {
    id: number
    fullName: string
    email: string
  }
}

interface MessagingProps {
  apiBase: string
}

export default function Messaging({ apiBase }: MessagingProps) {
  const { user, token } = useAuth()
  const [contacts, setContacts] = useState<any[]>([])
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load all users as potential contacts
  useEffect(() => {
    const loadContacts = async () => {
      if (!token || !user) return

      try {
        const response = await fetch(`${apiBase}/api/users?limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Filter out current user
          const filtered = data.users.filter((u: any) => u.id !== user.id)
          setContacts(filtered)
        }
      } catch (error) {
        console.error('Failed to load contacts:', error)
      }
    }

    loadContacts()
  }, [token, user])

  // Load messages when contact is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!token || !selectedContact) return

      try {
        const response = await fetch(
          `${apiBase}/api/messages/${selectedContact.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    }

    loadMessages()
    const interval = setInterval(loadMessages, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [selectedContact, token])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !token) return

    setIsLoading(true)
    try {
      const response = await fetch(`${apiBase}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([...messages, data])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', height: '600px' }}>
      {/* Contacts List */}
      <div
        style={{
          width: '250px',
          borderRight: '1px solid #e2e8f0',
          overflowY: 'auto',
          backgroundColor: '#f7fafc',
        }}
      >
        <div style={{ padding: '1rem', fontWeight: 'bold' }}>Danh sách liên hệ</div>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedContact(contact)}
            style={{
              padding: '1rem',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
              backgroundColor:
                selectedContact?.id === contact.id ? '#e6f3ff' : 'white',
              borderLeft:
                selectedContact?.id === contact.id ? '4px solid #667eea' : 'none',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {contact.fullName}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#718096' }}>
              {contact.role}
            </div>
          </div>
        ))}
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedContact ? (
          <>
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid #e2e8f0',
                fontWeight: 'bold',
              }}
            >
              💬 {selectedContact.fullName}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf:
                      msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor:
                      msg.senderId === user?.id ? '#667eea' : '#e2e8f0',
                    color: msg.senderId === user?.id ? 'white' : 'black',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập tin nhắn..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                📤 Gửi
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#718096',
            }}
          >
            Chọn một liên hệ để bắt đầu
          </div>
        )}
      </div>
    </div>
  )
}
