import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attendeeService } from '../services/api';
import { Save, ArrowLeft, User } from 'lucide-react';

const AttendeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    attendeeService.getById(id)
      .then(res => setFormData({ name: res.data.name }))
      .catch(() => setError('Failed to load profile data'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await attendeeService.update(id, formData);
      setSuccess('Profile updated!');
      setTimeout(() => navigate(`/attendees/${id}`), 1500);
    } catch (err) {
      setError(err.response?.data || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center" style={{ justifyContent: 'center', minHeight: '80vh' }}><div className="spinner"></div></div>;

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="card glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>Edit Your Name</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label flex items-center gap-2"><User size={16} /> Display Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required 
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              {saving ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 
               <><Save size={20} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendeeFormPage;
