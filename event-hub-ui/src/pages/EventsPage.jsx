import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Calendar, MapPin, Users, Info } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    eventService.getAll()
      .then(res => setEvents(res.data))
      .catch(err => {
        const msg = err.response?.data || 'Failed to load events';
        setError(typeof msg === 'string' ? msg : 'Error loading data');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Upcoming Events</h1>
          <p style={{ color: 'var(--text-muted)' }}>Discover and join amazing experiences</p>
        </div>
        
        {(user?.role === 'Organizer' || user?.role === 'Admin') && (
          <Link to="/events/new" className="btn btn-primary">
            <Plus size={20} /> Create Event
          </Link>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '0.75rem', marginBottom: '3rem', display: 'flex', alignItems: 'center' }}>
        <Search size={20} style={{ marginLeft: '1rem', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by title or location..." 
          style={{ border: 'none', background: 'transparent' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="flex items-center" style={{ justifyContent: 'center', minHeight: '300px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 grid-cols-3 gap-4">
          {filteredEvents.map(event => {
            const percent = (event.registeredCount / event.capacity) * 100;
            const isFull = event.registeredCount >= event.capacity;

            return (
              <div key={event.id} className="card">
                <div className="flex justify-between items-start" style={{ marginBottom: '1.5rem' }}>
                  <span className={`role-badge ${isFull ? 'role-admin' : 'role-attendee'}`} style={{ fontSize: '0.6rem' }}>
                    {isFull ? 'FULL' : 'OPEN'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    by {event.organizerName}
                  </span>
                </div>

                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{event.title}</h3>
                
                <div style={{ spaceY: '0.5rem', marginBottom: '2rem' }}>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span className="flex items-center gap-1"><Users size={14} /> {event.registeredCount} / {event.capacity}</span>
                    <span style={{ fontWeight: '600', color: isFull ? 'var(--error)' : 'var(--success)' }}>
                      {Math.round(percent)}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${percent}%`, 
                      background: isFull ? 'var(--error)' : 'linear-gradient(90deg, var(--primary), var(--accent))',
                      borderRadius: '10px',
                      transition: 'width 1s ease-in-out'
                    }}></div>
                  </div>
                </div>

                <Link to={`/events/${event.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                  <Info size={18} /> View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="text-center" style={{ padding: '5rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No events found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
