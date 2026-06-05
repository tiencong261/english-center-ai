import React, { useState } from 'react';

interface Invoice {
  id: string;
  studentName: string;
  course: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID';
}

interface BillingInvoiceProps {
  apiBase: string;
  role: 'admin' | 'staff' | 'student';
}

export default function BillingInvoice({ apiBase, role }: BillingInvoiceProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    studentName: 'Nguyễn Văn A',
    course: 'IELTS 6.0',
    amount: 3500000,
    dueDate: '2026-06-15',
  });

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-001', studentName: 'Nguyễn Văn A', course: 'IELTS 6.0', amount: 3500000, dueDate: '2026-06-15', status: 'UNPAID' },
    { id: 'INV-002', studentName: 'Trần Thị B', course: 'IELTS foundations', amount: 2800000, dueDate: '2026-06-10', status: 'PAID' },
    { id: 'INV-003', studentName: 'Lê Hoàng C', course: 'Speaking Mastery', amount: 4500000, dueDate: '2026-06-25', status: 'UNPAID' },
  ]);

  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  const handleInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/payments/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceForm),
      });
      const data = await res.json();
      setResult(data);

      const newInv: Invoice = {
        id: `INV-${Math.floor(100 + Math.random() * 900)}`,
        studentName: invoiceForm.studentName,
        course: invoiceForm.course,
        amount: invoiceForm.amount,
        dueDate: invoiceForm.dueDate,
        status: 'UNPAID',
      };
      setInvoices((prev) => [newInv, ...prev]);
    } catch (err) {
      // Mock generation fallback
      const mockResult = {
        success: true,
        invoiceId: `INV-${Math.floor(100 + Math.random() * 900)}`,
        studentName: invoiceForm.studentName,
        course: invoiceForm.course,
        amount: invoiceForm.amount,
        dueDate: invoiceForm.dueDate,
        paymentLink: 'https://pay.englishcenter.ai/mock-invoice-link'
      };
      setResult(mockResult);

      const newInv: Invoice = {
        id: mockResult.invoiceId,
        studentName: invoiceForm.studentName,
        course: invoiceForm.course,
        amount: invoiceForm.amount,
        dueDate: invoiceForm.dueDate,
        status: 'UNPAID',
      };
      setInvoices((prev) => [newInv, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerPay = (inv: Invoice) => {
    setActiveInvoice(inv);
    setShowPaymentGate(true);
  };

  const handleConfirmMockPay = () => {
    if (!activeInvoice) return;
    setInvoices(prev => prev.map(inv => {
      if (inv.id === activeInvoice.id) {
        return { ...inv, status: 'PAID' };
      }
      return inv;
    }));
    setShowPaymentGate(false);
    setActiveInvoice(null);
    alert("Thanh toán thành công qua chuyển khoản QR Code! Hệ thống AI đã cập nhật trạng thái đóng học phí.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      <div>
        <h2 style={{ margin: 0 }}>💰 Module 9: Billing & Quản Lý Đóng Học Phí</h2>
        <p style={{ color: '#666', marginTop: '0.25rem' }}>Quản lý thu phí chuyên nghiệp: Tự động khởi tạo hóa đơn, đồng bộ trạng thái đóng học phí của từng học viên và cung cấp QR Code thanh toán tức thời.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Create Invoice Form */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📄 Tạo Hóa Đơn Mới</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Học viên cần đóng phí:</label>
              <input
                type="text"
                value={invoiceForm.studentName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, studentName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Khóa học / Gói học phí:</label>
              <input
                type="text"
                value={invoiceForm.course}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, course: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Số tiền học phí (VND):</label>
              <input
                type="number"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '500', display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Hạn đóng học phí:</label>
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="button"
              onClick={handleInvoice}
              disabled={loading || role === 'student'}
              style={{
                padding: '0.75rem',
                backgroundColor: role === 'student' ? '#ccc' : '#8E24AA',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: role === 'student' ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              {loading ? 'Đang tạo hoá đơn...' : 'Tạo Hoá Đơn Học Phí'}
            </button>
            {role === 'student' && <span style={{ fontSize: '0.8rem', color: 'red' }}>⚠️ Học sinh không được phép khởi tạo hóa đơn.</span>}
          </form>
        </div>

        {/* Invoice List & Payment simulation */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>📋 Danh Sách Phiếu Học Phí</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', overflowY: 'auto', maxHeight: '420px' }}>
            {invoices.map((inv) => (
              <div key={inv.id} style={{ padding: '0.9rem', border: '1px solid #edf2f7', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', backgroundColor: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>{inv.id}</span>
                    <strong style={{ fontSize: '0.95rem' }}>{inv.studentName}</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginTop: '0.25rem' }}>
                    Khóa: {inv.course} • Hạn nộp: {inv.dueDate}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#d53f8c', display: 'block', marginTop: '0.25rem' }}>
                    {inv.amount.toLocaleString()}đ
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {inv.status === 'PAID' ? (
                    <span style={{ backgroundColor: '#c6f6d5', color: '#22543d', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      🟢 Đã Đóng
                    </span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                      <span style={{ backgroundColor: '#fed7d7', color: '#742a2a', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        🔴 Chưa Đóng
                      </span>
                      <button
                        onClick={() => handleTriggerPay(inv)}
                        style={{ padding: '0.25rem 0.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Thanh toán
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mock QR Code payment gate modal popup */}
      {showPaymentGate && activeInvoice && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '380px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>💳 Cổng Thanh Toán Trực Tuyến</h3>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>Quét mã QR dưới đây để thực hiện giao dịch chuyển khoản ngân hàng tự động.</p>
            
            {/* Mock QR Code frame */}
            <div style={{ border: '2px solid #eee', padding: '1rem', borderRadius: '8px', display: 'inline-block', margin: '1rem 0', backgroundColor: '#fafafa' }}>
              <div style={{ width: '160px', height: '160px', backgroundColor: '#333', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', margin: '0 auto', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>📱</span>
                <strong>VIETQR COOPBANK</strong>
                <span style={{ fontSize: '0.75rem' }}>{activeInvoice.id}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#333' }}>
              Học viên: <strong>{activeInvoice.studentName}</strong><br />
              Số tiền: <strong style={{ color: '#e91e63' }}>{activeInvoice.amount.toLocaleString()}đ</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => { setShowPaymentGate(false); setActiveInvoice(null) }}
                style={{ flex: 1, padding: '0.6rem', backgroundColor: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmMockPay}
                style={{ flex: 1.5, padding: '0.6rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Xác Nhận Đã Chuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
