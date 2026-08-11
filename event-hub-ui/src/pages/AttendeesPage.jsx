import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendeeService } from '../services/api';
import { Search, User, Mail, Calendar } from 'lucide-react';

const AttendeesPage = () => {
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    attendeeService.getAll()
      .then(res => setAttendees(res.data))
      .catch(() => setError('Only Administrators can view the attendees list.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = attendees.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Event Attendees</h1>

      <div className="glass-panel" style={{ padding: '0.75rem', marginBottom: '3rem', display: 'flex', alignItems: 'center' }}>
        <Search size={20} style={{ marginLeft: '1rem', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by name or email..." 
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
        <div className="grid grid-cols-1 grid-cols-2 gap-4">
          {filtered.map(person => (
            <div key={person.id} className="card flex items-center gap-6" style={{ padding: '1.5rem 2rem' }}>
              <div style={{ background: 'var(--accent)', padding: '1rem', borderRadius: '50%', color: 'white' }}>
                <User size={32} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{person.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} className="flex items-center gap-2">
                  <Mail size={14} /> {person.email}
                </p>
                <div className="flex items-center gap-4 mt-4">
                   <span className="role-badge role-attendee" style={{ fontSize: '0.6rem' }}>
                    {person.registeredEvents?.length || 0} Registrations
                   </span>
                   <Link to={`/attendees/${person.id}`} className="nav-link" style={{ fontSize: '0.85rem' }}>
                      View Profile
                   </Link>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !error && (
            <div className="text-center" style={{ gridColumn: 'span 2', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No attendees found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendeesPage;
