import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, subtitle, color, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon stat-card-icon-${color || 'primary'}`}>
          {Icon && <Icon size={20} />}
        </div>
        {trend && (
          <span className={`stat-card-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  );
}
