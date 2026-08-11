import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizerService } from '../services/api';
import { Save, ArrowLeft, User, Mail, Globe, Phone, FileText } from 'lucide-react';

const OrganizerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    website: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    organizerService.getById(id)
      .then(res => {
        const { name, bio, phone, website } = res.data;
        setFormData({ name, bio: bio || '', phone: phone || '', website: website || '' });
      })
      .catch(() => setError('Failed to load organizer data'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await organizerService.update(id, formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate(`/organizers/${id}`), 1500);
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

      <div className="card glass-panel" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>Edit Organizer Profile</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div className="form-group">
            <label className="form-label flex items-center gap-2"><User size={16} /> Full Name</label>
            <input 
              name="name"
              type="text" 
              className="form-control" 
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label flex items-center gap-2"><Phone size={16} /> Phone</label>
              <input 
                name="phone"
                type="text" 
                className="form-control" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label flex items-center gap-2"><Globe size={16} /> Website</label>
              <input 
                name="website"
                type="text" 
                className="form-control" 
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-2"><FileText size={16} /> Professional Bio</label>
            <textarea 
              name="bio"
              className="form-control" 
              rows="6"
              value={formData.bio}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              {saving ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 
               <><Save size={20} /> Save Profile</>}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizerFormPage;
