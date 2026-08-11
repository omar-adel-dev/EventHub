import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { attendeeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, ArrowLeft, Edit, Trash2 } from 'lucide-react';

const AttendeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [attendee, setAttendee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    attendeeService.getById(id)
      .then(res => setAttendee(res.data))
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this account?')) return;
    try {
      await attendeeService.delete(id);
      navigate('/attendees');
    } catch {
      setError('Delete failed.');
    }
  };

  if (loading) return <div className="flex items-center" style={{ justifyContent: 'center', minHeight: '80vh' }}><div className="spinner"></div></div>;
  if (!attendee) return <div className="container text-center mt-4">Attendee not found.</div>;

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="card glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: '3rem' }}>
          <div className="flex items-center gap-6">
            <div style={{ background: 'var(--accent)', padding: '2rem', borderRadius: '50%', color: 'white' }}>
              <User size={48} />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{attendee.name}</h1>
              <span className="role-badge role-attendee">Event Enthusiast</span>
            </div>
          </div>
          <div className="flex gap-2">
            {user?.role === 'Admin' && (
              <button onClick={handleDelete} className="btn btn-secondary" style={{ color: 'var(--error)' }}>
                <Trash2 size={18} />
              </button>
            )}
            {(user?.role === 'Admin' || (user?.role === 'Attendee' && user.email === attendee.email)) && (
              <Link to={`/attendees/${id}/edit`} className="btn btn-primary">
                <Edit size={18} /> Edit Profile
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 grid-cols-2 gap-8">
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Account Details</h3>
            <div className="flex items-center gap-4 mb-4">
              <Mail className="text-muted" size={20} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</p>
                <p>{attendee.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Event Activity</h3>
            <div className="card" style={{ background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)' }}>
                {attendee.registeredEvents?.length || 0}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Events Registered</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '2rem' }}>Registered Events</h3>
          <div className="grid grid-cols-1 gap-2">
            {attendee.registeredEvents?.length > 0 ? attendee.registeredEvents.map((evt, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 card" style={{ padding: '1rem 1.5rem' }}>
                <Calendar size={18} className="text-primary" style={{ color: 'var(--primary)' }} />
                <span>{evt}</span>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No events registered yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDetailPage;
