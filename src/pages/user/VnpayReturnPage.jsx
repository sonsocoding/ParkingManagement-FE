import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { paymentService } from '../../api/index';
import { formatCurrency } from '../../utils/formatters';

const getPaymentTargetLabel = (payment) => {
  if (payment?.bookingId) {
    return 'booking';
  }

  if (payment?.metadata?.type === 'MONTHLY_PASS_RENEWAL') {
    return 'monthly pass renewal';
  }

  if (payment?.monthlyPassId) {
    return 'monthly pass';
  }

  return 'payment';
};

const getStatusCopy = (message, payment) => {
  const targetLabel = getPaymentTargetLabel(payment);

  if (message === 'VNPay payment completed') {
    return {
      title: 'Payment confirmed',
      tone: 'success',
      description: `VNPay reported a successful payment. Your ${targetLabel} should now be updated in the system.`,
    };
  }

  return {
    title: 'Payment not completed',
    tone: 'warning',
    description: `VNPay returned a failed or cancelled result. Your ${targetLabel} will not be updated until a successful payment is received.`,
  };
};

export default function VnpayReturnPage() {
  const location = useLocation();
  const [state, setState] = useState({
    loading: true,
    error: null,
    verification: null,
  });

  useEffect(() => {
    const queryString = location.search.replace(/^\?/, '');
    if (!queryString) {
      setState({
        loading: false,
        error: 'Missing VNPay response data.',
        verification: null,
      });
      return;
    }

    let isMounted = true;
    paymentService.verifyVnpayReturn(queryString)
      .then((res) => {
        if (!isMounted) return;
        setState({
          loading: false,
          error: null,
          verification: res,
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        setState({
          loading: false,
          error: err?.message || 'Unable to verify the VNPay response.',
          verification: null,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  const payment = state.verification?.data?.payment;
  const vnpay = state.verification?.data?.vnpay;
  const copy = getStatusCopy(state.verification?.message, payment);

  return (
    <>
      <TopBar title="VNPay Return" subtitle="Sandbox payment verification" />
      <div className="page-content">
        <div className="card" style={{ maxWidth: '760px', margin: '0 auto' }}>
          {state.loading && <p>Verifying VNPay response...</p>}

          {!state.loading && state.error && (
            <>
              <h2 className="headline-sm" style={{ marginBottom: '12px' }}>Verification failed</h2>
              <p style={{ color: 'var(--color-occupied)', marginBottom: '20px' }}>{state.error}</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link className="btn btn-secondary" to="/my-bookings">My Bookings</Link>
                <Link className="btn btn-secondary" to="/monthly-passes">Monthly Passes</Link>
              </div>
            </>
          )}

          {!state.loading && !state.error && (
            <>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  background: copy.tone === 'success' ? 'rgba(33, 128, 141, 0.12)' : 'rgba(168, 75, 47, 0.12)',
                  border: `1px solid ${copy.tone === 'success' ? 'rgba(33, 128, 141, 0.28)' : 'rgba(168, 75, 47, 0.28)'}`,
                }}
              >
                <h2 className="headline-sm" style={{ marginBottom: '8px' }}>{copy.title}</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{copy.description}</p>
              </div>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                <div><strong>Payment ID:</strong> {payment?.id || '—'}</div>
                <div><strong>Amount:</strong> {payment?.amount ? formatCurrency(payment.amount) : '—'}</div>
                <div><strong>Method:</strong> {payment?.method || '—'}</div>
                <div><strong>Payment Status:</strong> {payment?.status || '—'}</div>
                <div><strong>VNPay Response Code:</strong> {vnpay?.vnp_ResponseCode || '—'}</div>
                <div><strong>VNPay Transaction No:</strong> {vnpay?.vnp_TransactionNo || '—'}</div>
                <div><strong>Verified:</strong> {vnpay?.isVerified ? 'Yes' : 'No'}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link className="btn btn-primary" to="/my-payments">My Payments</Link>
                <Link className="btn btn-secondary" to="/my-bookings">My Bookings</Link>
                <Link className="btn btn-secondary" to="/monthly-passes">Monthly Passes</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
