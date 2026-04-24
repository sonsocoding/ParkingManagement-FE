import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { MapPin, Car, Bike, Search, Filter, Clock } from 'lucide-react';
import { parkingLots, formatCurrency } from '../../data/sampleData';
import './BrowseLots.css';

export default function BrowseLots() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filtered = parkingLots.filter(lot => {
    const matchSearch = lot.name.toLowerCase().includes(search.toLowerCase()) ||
                       lot.address.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || lot.lotType === filterType;
    return matchSearch && matchType;
  });

  return (
    <>
      <TopBar title="Browse Parking Lots" subtitle="Find and book your perfect parking spot" />
      <div className="page-content">
        {/* Search & Filters */}
        <div className="lots-toolbar">
          <div className="lots-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="lots-filters">
            {['ALL', 'CAR_ONLY', 'MOTORBIKE_ONLY', 'BOTH'].map(type => (
              <button
                key={type}
                className={`btn ${filterType === type ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'ALL' ? 'All' : type === 'BOTH' ? 'Mixed' : type === 'CAR_ONLY' ? '🚗 Cars' : '🏍️ Bikes'}
              </button>
            ))}
          </div>
        </div>

        {/* Lots Grid */}
        <div className="lots-grid">
          {filtered.map((lot) => {
            const occupancy = Math.round(((lot.occupiedSlots + lot.reservedSlots) / lot.totalSlots) * 100);
            const isLow = lot.availableSlots < 10;
            return (
              <div
                key={lot.id}
                className="lot-card card card-hover"
                onClick={() => navigate(`/parking-lots/${lot.id}`)}
              >
                {/* Visual Header */}
                <div className={`lot-card-visual ${isLow ? 'lot-card-visual-low' : ''}`}>
                  <div className="lot-card-visual-pattern">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className={`lot-mini-slot ${Math.random() > 0.5 ? 'filled' : ''}`} />
                    ))}
                  </div>
                  <div className="lot-card-badge-wrap">
                    <span className={`badge ${lot.lotType === 'CAR_ONLY' ? 'badge-car' : lot.lotType === 'MOTORBIKE_ONLY' ? 'badge-motorbike' : 'badge-completed'}`}>
                      {lot.lotType === 'CAR_ONLY' ? '🚗 Cars Only' : lot.lotType === 'MOTORBIKE_ONLY' ? '🏍️ Bikes Only' : '🚗🏍️ Mixed'}
                    </span>
                    {isLow && <span className="badge badge-occupied">Low availability</span>}
                  </div>
                </div>

                {/* Info */}
                <div className="lot-card-body">
                  <h3 className="lot-card-name">{lot.name}</h3>
                  <p className="lot-card-address">
                    <MapPin size={14} /> {lot.address}
                  </p>

                  {/* Slot Stats */}
                  <div className="lot-card-stats">
                    <div className="lot-card-stat">
                      <span className="lot-card-stat-dot available" />
                      <span>{lot.availableSlots} free</span>
                    </div>
                    <div className="lot-card-stat">
                      <span className="lot-card-stat-dot occupied" />
                      <span>{lot.occupiedSlots} taken</span>
                    </div>
                    <div className="lot-card-stat">
                      <span className="lot-card-stat-dot reserved" />
                      <span>{lot.reservedSlots} reserved</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="lot-card-bar">
                    <div className="lot-card-bar-fill" style={{ width: `${occupancy}%` }} />
                  </div>

                  {/* Pricing */}
                  <div className="lot-card-pricing">
                    {parseFloat(lot.carHourlyRate) > 0 && (
                      <div className="lot-card-price">
                        <Car size={14} />
                        <span>{formatCurrency(lot.carHourlyRate)}</span>
                        <span className="price-unit">/hr</span>
                      </div>
                    )}
                    {parseFloat(lot.motorbikeHourlyRate) > 0 && (
                      <div className="lot-card-price">
                        <Bike size={14} />
                        <span>{formatCurrency(lot.motorbikeHourlyRate)}</span>
                        <span className="price-unit">/hr</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lot-card-footer">
                  <button className="btn btn-primary btn-sm w-full">View & Book</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
