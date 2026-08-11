import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizerService } from '../services/api';
import { Search, Globe, Mail, Phone, ExternalLink } from 'lucide-react';

const OrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    organizerService.getAll()
      .then(res => setOrganizers(res.data))
      .catch(() => setError('Failed to load organizers.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = organizers.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Event Organizers</h1>

      <div className="glass-panel" style={{ padding: '0.75rem', marginBottom: '3rem', display: 'flex', alignItems: 'center' }}>
        <Search size={20} style={{ marginLeft: '1rem', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search organizers..." 
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
        <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1.25rem 1.5rem' }}>Name</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Email</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Events</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Website</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(org => (
                <tr key={org.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>{org.name}</td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{org.email}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span className="role-badge role-organizer">{org.totalEvents} Events</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {org.website ? (
                      <a href={org.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                        <Globe size={18} />
                      </a>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <Link to={`/organizers/${org.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No organizers found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizersPage;
