import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useAllPayments } from '../../hooks/useApi';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { Search, Filter } from 'lucide-react';

export default function AllPayments() {
  const { payments, loading, error } = useAllPayments();
  const [searchTerm, setSearchTerm] = useState('');
  const getPaymentType = (payment) => {
    if (payment.bookingId) return 'Booking';
    if (payment.parkingRecordId) return 'Walk-in';
    if (payment.monthlyPassId) return 'Monthly Pass';
    return 'Other';
  };

  const filteredPayments = payments.filter(p =>
    (p.user?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TopBar title="All Payments" subtitle="System-wide payment ledger" />
      <div className="page-content">
        <div className="card">
          <div className="dashboard-card-header" style={{ marginBottom: '16px' }}>
            <div className="lots-search" style={{ margin: 0, width: '300px' }}>
              <Search size={16} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <button className="btn btn-secondary btn-sm"><Filter size={16} /> Filter</button>
          </div>

          {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading payments...</p>}
          {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{p.id.slice(0, 12)}…</td>
                    <td style={{ fontWeight: 500 }}>{p.user?.fullName || '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(p.amount)}</td>
                    <td><span className="badge badge-completed">{p.method}</span></td>
                    <td>{getPaymentType(p)}</td>
                    <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                    <td style={{ fontSize: '13px' }}>{formatDateTime(p.createdAt)}</td>
                  </tr>
                ))}
                {!loading && filteredPayments.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '32px' }}>No payments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
