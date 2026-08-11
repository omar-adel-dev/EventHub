import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, ArrowLeft, Edit, Trash2, CheckCircle } from 'lucide-react';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = () => {
    setLoading(true);
    eventService.getById(id)
      .then(res => setEvent(res.data))
      .catch(err => setError('Failed to load event details.'))
      .finally(() => setLoading(false));
  };

  const handleRegister = async () => {
    setRegistering(true);
    setError('');
    try {
      await eventService.registerForEvent(id);
      setSuccess('Successfully registered for this event!');
      fetchEvent(); // Refresh data
    } catch (err) {
      const msg = err.response?.data || 'Registration failed';
      setError(typeof msg === 'string' ? msg : 'Error during registration');
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    setDeleting(true);
    try {
      await eventService.delete(id);
      navigate('/events');
    } catch (err) {
      setError('Failed to delete event.');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center" style={{ justifyContent: 'center', minHeight: '80vh' }}>
      <div className="spinner"></div>
    </div>
  );

  if (!event) return (
    <div className="container text-center" style={{ padding: '5rem 0' }}>
      <p style={{ color: 'var(--error)' }}>{error || 'Event not found.'}</p>
      <Link to="/events" className="btn btn-secondary mt-4">Back to Events</Link>
    </div>
  );

  const isFull = event.registeredCount >= event.capacity;

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 grid-cols-2 gap-4 items-start">
        <div className="card glass-panel" style={{ padding: '3rem' }}>
          <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
            <span className="role-badge role-organizer">Hosted by {event.organizerName}</span>
            <div className="flex gap-2">
              {(user?.role === 'Admin' || user?.role === 'Organizer') && (
                <Link to={`/events/${id}/edit`} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                  <Edit size={18} />
                </Link>
              )}
              {user?.role === 'Admin' && (
                <button onClick={handleDelete} className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--error)' }} disabled={deleting}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>{event.title}</h1>
          
          <div className="flex flex-wrap gap-6" style={{ marginBottom: '2.5rem' }}>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</p>
                <p style={{ fontWeight: '600' }}>{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-primary" size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</p>
                <p style={{ fontWeight: '600' }}>{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-primary" size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacity</p>
                <p style={{ fontWeight: '600' }}>{event.registeredCount} / {event.capacity} Registered</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Description</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{event.description}</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {user?.role === 'Attendee' && (
            <button 
              onClick={handleRegister} 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem' }}
              disabled={registering || isFull}
            >
              {registering ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 
               isFull ? 'Event is Full' : <><CheckCircle size={20} /> Register for Event</>}
            </button>
          )}
          
          {!user && (
            <div className="alert alert-info" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', color: 'var(--text)' }}>
              Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Login</Link> as an Attendee to register.
            </div>
          )}
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Registration Progress</h3>
          <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ 
              height: '100%', 
              width: `${(event.registeredCount / event.capacity) * 100}%`, 
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: '20px'
            }}></div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Join {event.registeredCount} others at this event. Only {event.capacity - event.registeredCount} spots left!
          </p>
          
          <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Share Event</h4>
            <div className="flex gap-4">
              <div className="btn-secondary btn" style={{ flex: 1, cursor: 'default' }}>Copy Link</div>
              <div className="btn-secondary btn" style={{ flex: 1, cursor: 'default' }}>Invite Friends</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
