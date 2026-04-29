import { useMemo, useState } from 'react';
import TopBar from '../../components/layout/TopBar';
import { useMyPayments } from '../../hooks/useApi';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import '../../styles/pages/user/MyPayments.css';

export default function MyPayments() {
  const { payments, loading, error } = useMyPayments();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const getPaymentType = (payment) => {
    if (payment.bookingId) return 'Booking';
    if (payment.parkingRecordId) return 'Walk-in';
    if (payment.monthlyPassId) return 'Monthly Pass';
    return 'Other';
  };

  const getSortValue = (payment, key) => {
    switch (key) {
      case 'date':
        return payment.createdAt ? new Date(payment.createdAt).getTime() : 0;
      case 'type':
        return getPaymentType(payment).toLowerCase();
      case 'amount':
        return Number(payment.amount) || 0;
      case 'method':
        return (payment.method || '').toLowerCase();
      case 'status':
        return (payment.status || '').toLowerCase();
      default:
        return payment.id || 0;
    }
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
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

      return (b.id || 0) - (a.id || 0);
    });
  }, [payments, sortConfig]);

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
      <TopBar title="My Payments" subtitle="Payment history and receipts" />
      <div className="page-content">
        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading payments...</p>}
        {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>{renderSortButton('Date', 'date')}</th>
                <th>{renderSortButton('Type', 'type')}</th>
                <th>{renderSortButton('Amount', 'amount')}</th>
                <th>{renderSortButton('Method', 'method')}</th>
                <th>{renderSortButton('Status', 'status')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map((p) => (
                <tr key={p.id}>
                  <td>{formatDateTime(p.createdAt)}</td>
                  <td>{getPaymentType(p)}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
                  <td><span className="badge badge-completed">{p.method}</span></td>
                  <td><span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              ))}
              {!loading && sortedPayments.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '32px' }}>No payment records yet. Cash bookings and walk-ins appear here after checkout.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
