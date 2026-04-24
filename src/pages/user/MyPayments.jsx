import TopBar from '../../components/layout/TopBar';
import { CreditCard, ArrowUpRight } from 'lucide-react';
import { payments, formatCurrency, formatDateTime } from '../../data/sampleData';

export default function MyPayments() {
  return (
    <>
      <TopBar title="My Payments" subtitle="Payment history and receipts" />
      <div className="page-content">
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
                  <td>{p.bookingId ? 'Booking' : p.monthlyPassId ? 'Monthly Pass' : 'Other'}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
                  <td><span className="badge badge-completed">{p.method}</span></td>
                  <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
