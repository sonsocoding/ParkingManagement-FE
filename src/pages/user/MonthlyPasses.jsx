import TopBar from '../../components/layout/TopBar';
import { Ticket, Calendar, Plus, RotateCw, X } from 'lucide-react';
import { monthlyPasses, formatCurrency, formatDate } from '../../data/sampleData';
import './MonthlyPasses.css';

export default function MonthlyPasses() {
  return (
    <>
      <TopBar
        title="Monthly Passes"
        subtitle="Subscription parking for regular users"
        actions={<button className="btn btn-primary btn-sm"><Plus size={16} /> Buy Pass</button>}
      />
      <div className="page-content">
        <div className="passes-grid">
          {monthlyPasses.map((pass) => (
            <div key={pass.id} className={`pass-card card ${pass.status === 'ACTIVE' ? 'pass-active' : ''}`}>
              <div className="pass-card-header">
                <div className="pass-card-icon">
                  <Ticket size={24} />
                </div>
                <span className={`badge badge-${pass.status.toLowerCase()}`}>{pass.status}</span>
              </div>
              <div className="pass-card-type">{pass.vehicleType} Monthly Pass</div>
              <div className="pass-card-price">{formatCurrency(pass.price)}</div>
              <div className="pass-card-dates">
                <div className="pass-date">
                  <Calendar size={14} />
                  <span>{formatDate(pass.startDate)} — {formatDate(pass.endDate)}</span>
                </div>
              </div>
              {pass.status === 'ACTIVE' && (
                <div className="pass-card-actions">
                  <button className="btn btn-secondary btn-sm"><RotateCw size={14} /> Renew</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-occupied)' }}><X size={14} /> Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
