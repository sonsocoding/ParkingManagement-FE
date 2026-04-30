import { useMemo, useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useAllPayments } from '../../hooks/useApi';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { Search } from 'lucide-react';
import '../../styles/pages/user/MyPayments.css';

export default function AllPayments() {
  const { payments, loading, error } = useAllPayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const getPaymentType = (payment) => {
    if (payment.bookingId) return 'Booking';
    if (payment.parkingRecordId) return 'Walk-in';
    if (payment.monthlyPassId) return 'Monthly Pass';
    return 'Other';
  };

  const getSortValue = (payment, key) => {
    switch (key) {
      case 'transactionId':
        return (payment.id || '').toLowerCase();
      case 'user':
        return (payment.user?.fullName || '').toLowerCase();
      case 'amount':
        return Number(payment.amount) || 0;
      case 'method':
        return (payment.method || '').toLowerCase();
      case 'type':
        return getPaymentType(payment).toLowerCase();
      case 'status':
        return (payment.status || '').toLowerCase();
      case 'date':
        return payment.createdAt ? new Date(payment.createdAt).getTime() : 0;
      default:
        return 0;
    }
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredPayments = payments.filter((payment) => {
    const quickSearch = searchTerm.trim().toLowerCase();

    if (
      quickSearch
      && !(payment.user?.fullName || '').toLowerCase().includes(quickSearch)
      && !payment.id.toLowerCase().includes(quickSearch)
    ) {
      return false;
    }

    return true;
  });

  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      const valueA = getSortValue(a, sortConfig.key);
      const valueB = getSortValue(b, sortConfig.key);
      let comparison = 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else {
        comparison = valueA - valueB;
      }

      if (comparison !== 0) {
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      const fallbackA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const fallbackB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (fallbackB !== fallbackA) return fallbackB - fallbackA;

      return (b.id || '').localeCompare(a.id || '');
    });
  }, [filteredPayments, sortConfig]);

  const renderSortButton = (label, key) => {
    const isActive = sortConfig.key === key;
    const arrow = isActive ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕';

    return (
      <button
        type="button"
        className={`payments-sort-button ${isActive ? 'active' : ''}`}
        onClick={() => handleSort(key)}
      >
        <span>{label}</span>
        <span className="payments-sort-arrow" aria-hidden="true">{arrow}</span>
      </button>
    );
  };

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
                placeholder="Search user or transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading payments...</p>}
          {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{renderSortButton('Transaction ID', 'transactionId')}</th>
                  <th>{renderSortButton('User', 'user')}</th>
                  <th>{renderSortButton('Amount', 'amount')}</th>
                  <th>{renderSortButton('Method', 'method')}</th>
                  <th>{renderSortButton('Type', 'type')}</th>
                  <th>{renderSortButton('Status', 'status')}</th>
                  <th>{renderSortButton('Date', 'date')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map(p => (
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
                {!loading && sortedPayments.length === 0 && (
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
