import { useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { payments, formatDateTime, formatCurrency } from '../../data/sampleData';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';

export default function AllPayments() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => 
    p.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{p.id}</td>
                    <td style={{ fontWeight: 500 }}>{p.user.fullName}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(p.amount)}</td>
                    <td><span className="badge badge-completed">{p.method}</span></td>
                    <td>{p.bookingId ? 'Booking' : p.monthlyPassId ? 'Monthly Pass' : 'Other'}</td>
                    <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                    <td style={{ fontSize: '13px' }}>{formatDateTime(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
