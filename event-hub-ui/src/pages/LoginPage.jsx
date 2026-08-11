import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('Attendee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginAttendee, loginOrganizer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'Attendee') {
        await loginAttendee(email, password);
      } else {
        await loginOrganizer(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data || 'Invalid email or password';
      setError(typeof msg === 'string' ? msg : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center" style={{ minHeight: 'calc(100vh - 80px)', justifyContent: 'center' }}>
      <div className="card glass-panel fade-in" style={{ width: '100%', maxWidth: '480px', padding: '3rem' }}>
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <div className="flex items-center" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '16px', color: 'white' }}>
              <LogIn size={32} />
            </div>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Login to manage your events</p>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
