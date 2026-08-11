import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { organizerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Globe, Phone, FileText, ArrowLeft, Edit, Trash2 } from 'lucide-react';

const OrganizerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    organizerService.getById(id)
      .then(res => setOrganizer(res.data))
      .catch(() => setError('Failed to load organizer details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this organizer?')) return;
    try {
      await organizerService.delete(id);
      navigate('/organizers');
    } catch {
      setError('Delete failed.');
    }
  };

  if (loading) return <div className="flex items-center" style={{ justifyContent: 'center', minHeight: '80vh' }}><div className="spinner"></div></div>;
  if (!organizer) return <div className="container text-center mt-4">Organizer not found.</div>;

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="card glass-panel" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: '3rem' }}>
          <div className="flex items-center gap-6">
            <div style={{ background: 'var(--primary)', padding: '2rem', borderRadius: '32px', color: 'white' }}>
              <User size={64} />
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{organizer.name}</h1>
              <span className="role-badge role-organizer">Professional Organizer</span>
            </div>
          </div>
          <div className="flex gap-2">
            {user?.role === 'Admin' && (
              <button onClick={handleDelete} className="btn btn-secondary" style={{ color: 'var(--error)' }}>
                <Trash2 size={18} />
              </button>
            )}
            {(user?.role === 'Admin' || (user?.role === 'Organizer' && user.email === organizer.email)) && (
              <Link to={`/organizers/${id}/edit`} className="btn btn-primary">
                <Edit size={18} /> Edit Profile
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Contact Information</h3>
            <div className="flex items-center gap-4">
              <Mail className="text-muted" size={20} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</p>
                <p>{organizer.email}</p>
              </div>
            </div>
            {organizer.phone && (
              <div className="flex items-center gap-4">
                <Phone className="text-muted" size={20} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</p>
                  <p>{organizer.phone}</p>
                </div>
              </div>
            )}
            {organizer.website && (
              <div className="flex items-center gap-4">
                <Globe className="text-muted" size={20} />
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Website</p>
                  <a href={organizer.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                    {organizer.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Professional Bio</h3>
            <div className="flex gap-4">
              <FileText className="text-muted" size={20} />
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                {organizer.bio || 'No bio provided.'}
              </p>
            </div>
            
            <div className="mt-8 card" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Experience</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{organizer.totalEvents} Total Events</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organized through EventHub</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDetailPage;
