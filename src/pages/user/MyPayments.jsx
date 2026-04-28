import TopBar from '../../components/layout/TopBar';
import { useMyPayments } from '../../hooks/useApi';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function MyPayments() {
  const { payments, loading, error } = useMyPayments();
  const getPaymentType = (payment) => {
    if (payment.bookingId) return 'Booking';
    if (payment.parkingRecordId) return 'Walk-in';
    if (payment.monthlyPassId) return 'Monthly Pass';
    return 'Other';
  };

  return (
    <>
      <TopBar title="My Payments" subtitle="Payment history and receipts" />
      <div className="page-content">
        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading payments...</p>}
        {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{formatDateTime(p.createdAt)}</td>
                  <td>{getPaymentType(p)}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
                  <td><span className="badge badge-completed">{p.method}</span></td>
                  <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              ))}
              {!loading && payments.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '32px' }}>No payment records yet. Cash bookings and walk-ins appear here after checkout.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
