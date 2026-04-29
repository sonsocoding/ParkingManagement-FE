import { useState } from 'react';
import { ArrowRight, Bike, Car, CheckCircle2, Clock3, CreditCard, Globe2, ShieldCheck, X } from 'lucide-react';
import TopBar from '../../components/layout/TopBar';
import { useMyPasses } from '../../hooks/useApi';
import { passService } from '../../api/index';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/pages/user/MonthlyPasses.css';

const PASS_TYPES = [
  {
    key: 'CAR',
    title: 'Car Pass',
    icon: Car,
    price: 1500000,
    accentClass: 'pass-type-car',
  },
  {
    key: 'MOTORBIKE',
    title: 'Motorbike Pass',
    icon: Bike,
    price: 300000,
    accentClass: 'pass-type-bike',
  },
];

const PASS_RULES = [
  { icon: CheckCircle2, label: 'Use any vehicle of this type' },
  { icon: Clock3, label: 'Only 1 active session at a time' },
  { icon: Globe2, label: 'Works across all parking lots' },
];

const STATUS_PRIORITY = {
  ACTIVE: 3,
  PENDING_PAYMENT: 2,
  EXPIRED: 1,
};

function getDisplayPass(passes, vehicleType) {
  const typedPasses = passes.filter((pass) => pass.vehicleType === vehicleType);
  if (typedPasses.length === 0) return null;

  return [...typedPasses].sort((a, b) => {
    const statusDelta = (STATUS_PRIORITY[b.status] || 0) - (STATUS_PRIORITY[a.status] || 0);
    if (statusDelta !== 0) return statusDelta;
    return new Date(b.endDate || 0).getTime() - new Date(a.endDate || 0).getTime();
  })[0];
}

function formatPassUntil(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const end = new Date(dateStr);
  const diffMs = end.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function getStatusCopy(pass) {
  if (!pass) {
    return {
      label: 'Not subscribed',
      tone: 'inactive',
      expiryLabel: null,
      urgencyLabel: null,
      actionLabel: 'Buy Pass',
    };
  }

  if (pass.status === 'ACTIVE') {
    const daysLeft = getDaysUntil(pass.endDate);
    return {
      label: 'Active',
      tone: 'active',
      expiryLabel: `Expires ${formatPassUntil(pass.endDate)}`,
      urgencyLabel: daysLeft !== null && daysLeft <= 7 ? `Expiring in ${Math.max(daysLeft, 0)} day${daysLeft === 1 ? '' : 's'}` : null,
      actionLabel: 'Extend Pass',
    };
  }

  if (pass.status === 'PENDING_PAYMENT') {
    return {
      label: 'Not subscribed',
      tone: 'pending',
      expiryLabel: 'Payment is still being confirmed by VNPay.',
      urgencyLabel: null,
      actionLabel: 'Buy Pass',
    };
  }

  return {
    label: 'Expired',
    tone: 'expired',
    expiryLabel: pass.endDate ? `Previous pass ended ${formatPassUntil(pass.endDate)}` : null,
    urgencyLabel: null,
    actionLabel: 'Extend Pass',
  };
}

export default function MonthlyPasses() {
  const { monthlyPasses, loading, error } = useMyPasses();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vehicleType: 'CAR', months: 1, passId: null });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const passCards = PASS_TYPES.map((type) => {
    const pass = getDisplayPass(monthlyPasses, type.key);
    return {
      ...type,
      pass,
      status: getStatusCopy(pass),
    };
  });

  const selectedPassType = PASS_TYPES.find((type) => type.key === form.vehicleType) || PASS_TYPES[0];

  const openPassModal = (card) => {
    setForm({
      vehicleType: card.key,
      months: 1,
      passId: ['ACTIVE', 'EXPIRED'].includes(card.pass?.status) ? card.pass.id : null,
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };

  const redirectToVnpay = (paymentUrl) => {
    if (!paymentUrl) {
      throw new Error('VNPay link was not returned by the server.');
    }
    window.location.assign(paymentUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = form.passId
        ? await passService.renewPass(form.passId, { months: form.months, paymentMethod: 'VNPAY' })
        : await passService.createPass({
            vehicleType: form.vehicleType,
            months: form.months,
            paymentMethod: 'VNPAY',
          });

      redirectToVnpay(res?.data?.paymentUrl);
      return;
    } catch (err) {
      setFormError(err?.message || 'Failed to continue pass.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TopBar
        title="Monthly Passes"
        subtitle="Simple subscriptions for cars and motorbikes"
      />
      <div className="page-content">
        {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading passes...</p>}
        {error && <p style={{ color: 'var(--color-occupied)', textAlign: 'center' }}>Error: {error}</p>}

        {!loading && !error && (
          <div className="passes-page">
            <div className="passes-grid">
              {passCards.map((card) => {
                const Icon = card.icon;
                const isActive = card.pass?.status === 'ACTIVE';
                const isExpired = card.pass?.status === 'EXPIRED';

                return (
                  <article
                    key={card.key}
                    className={`pass-card ${card.accentClass} ${isActive ? 'pass-active' : ''} ${isExpired ? 'pass-expired' : ''}`}
                  >
                    <div className="pass-card-header">
                      <div className="pass-card-identity">
                        <div className="pass-card-icon">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="pass-card-title">{card.title}</h3>
                          <p className="pass-card-price">
                            <strong>{formatCurrency(card.price)}</strong>
                            <span>/ month</span>
                          </p>
                        </div>
                      </div>
                      <span className={`pass-state-pill pass-state-${card.status.tone}`}>
                        {card.status.label}
                      </span>
                    </div>

                    <div className="pass-card-status">
                      <div className="pass-card-status-row">
                        {card.status.expiryLabel && <p>{card.status.expiryLabel}</p>}
                        {!card.status.expiryLabel && <p>Start when you need recurring parking access.</p>}
                        {card.status.urgencyLabel && (
                          <span className="pass-urgency-pill">{card.status.urgencyLabel}</span>
                        )}
                      </div>
                    </div>

                    <section className="pass-rules">
                      <p className="pass-rules-title">How it works</p>
                      <div className="pass-rules-list">
                        {PASS_RULES.map((rule) => {
                          const RuleIcon = rule.icon;
                          return (
                            <div key={rule.label} className="pass-rule-item">
                              <RuleIcon size={16} />
                              <span>{rule.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <button className="btn btn-primary pass-card-cta" onClick={() => openPassModal(card)}>
                      {card.status.actionLabel}
                      <ArrowRight size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card pass-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="pass-modal-eyebrow">Monthly subscription</p>
                <h3 className="headline-sm">{selectedPassType.title}</h3>
              </div>
              <button className="btn-icon" onClick={closeModal}><X size={20} /></button>
            </div>

            <form className="modal-body pass-modal-body" onSubmit={handleSubmit}>
              <div className="pass-modal-summary">
                <div>
                  <span className="pass-modal-label">Price</span>
                  <strong>{formatCurrency(selectedPassType.price)} / month</strong>
                </div>
                <div className="pass-modal-payment">
                  <ShieldCheck size={16} />
                  <span>Secure payment via VNPay</span>
                </div>
              </div>

              <section className="pass-modal-section">
                <p className="pass-modal-section-title">Choose duration</p>
                <div className="duration-options">
                  {[1, 3, 6].map((months) => (
                    <button
                      key={months}
                      type="button"
                      className={`duration-option ${form.months === months ? 'duration-option-active' : ''}`}
                      onClick={() => setForm((current) => ({ ...current, months }))}
                    >
                      <span>{months}</span>
                      <small>{months === 1 ? '1 month' : `${months} months`}</small>
                    </button>
                  ))}
                </div>
              </section>

              <div className="pass-modal-total">
                <span>Total</span>
                <strong>{formatCurrency(selectedPassType.price * form.months)}</strong>
              </div>

              <div className="pass-modal-note">
                <CreditCard size={16} />
                <span>You will continue to VNPay to finish payment securely.</span>
              </div>

              {formError && <p style={{ color: 'var(--color-occupied)', fontSize: '13px' }}>{formError}</p>}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary pass-modal-submit" disabled={saving}>
                  {saving ? 'Processing...' : 'Continue to VNPay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
