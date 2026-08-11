import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { attendeeService, organizerService } from '../services/api';
import { UserPlus, User, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState('Attendee');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    phone: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (role === 'Attendee') {
        const payload = { name: formData.name, email: formData.email, password: formData.password };
        await attendeeService.create(payload);
      } else {
        await organizerService.create(formData);
      }
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data || 'Registration failed';
      setError(typeof msg === 'string' ? msg : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem 0', justifyContent: 'center' }}>
      <div className="card glass-panel fade-in" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <div className="flex items-center" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--secondary)', padding: '1rem', borderRadius: '16px', color: 'white' }}>
              <UserPlus size={32} />
            </div>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join EventHub to start your journey</p>
        </div>

        <div className="flex gap-2" style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.4rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <button 
            className="btn" 
            style={{ 
              flex: 1, 
              background: role === 'Attendee' ? 'var(--surface)' : 'transparent',
              color: role === 'Attendee' ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.9rem'
            }}
            onClick={() => setRole('Attendee')}
          >
            <User size={18} /> Attendee
          </button>
          <button 
            className="btn" 
            style={{ 
              flex: 1, 
              background: role === 'Organizer' ? 'var(--surface)' : 'transparent',
              color: role === 'Organizer' ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.9rem'
            }}
            onClick={() => setRole('Organizer')}
          >
            <ShieldCheck size={18} /> Organizer
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              name="name"
              type="text" 
              className="form-control" 
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              name="email"
              type="email" 
              className="form-control" 
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              name="password"
              type="password" 
              className="form-control" 
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          {role === 'Organizer' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input 
                  name="phone"
                  type="text" 
                  className="form-control" 
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input 
                  name="website"
                  type="text" 
                  className="form-control" 
                  placeholder="https://..."
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Bio</label>
                <textarea 
                  name="bio"
                  className="form-control" 
                  rows="3"
                  placeholder="Tell us about yourself or your organization"
                  value={formData.bio}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
