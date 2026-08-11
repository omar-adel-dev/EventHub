import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { Save, ArrowLeft, Calendar, FileText, MapPin, Hash } from 'lucide-react';

const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    capacity: 0,
    location: ''
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      eventService.getById(id)
        .then(res => {
          const data = res.data;
          // Format date for input type="date"
          const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
          setFormData({ ...data, date: formattedDate });
        })
        .catch(() => setError('Failed to load event data'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (isEdit) {
        await eventService.update(id, formData);
        setSuccess('Event updated successfully!');
      } else {
        await eventService.create(formData);
        setSuccess('Event created successfully!');
      }
      setTimeout(() => navigate('/events'), 1500);
    } catch (err) {
      const msg = err.response?.data || 'Operation failed';
      setError(typeof msg === 'string' ? msg : 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center" style={{ justifyContent: 'center', minHeight: '80vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="card glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div className="form-group">
            <label className="form-label flex items-center gap-2"><FileText size={16} /> Event Title</label>
            <input 
              name="title"
              type="text" 
              className="form-control" 
              placeholder="Enter a catchy title"
              value={formData.title}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label flex items-center gap-2"><Calendar size={16} /> Date</label>
              <input 
                name="date"
                type="date" 
                className="form-control" 
                value={formData.date}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label flex items-center gap-2"><Hash size={16} /> Capacity</label>
              <input 
                name="capacity"
                type="number" 
                className="form-control" 
                placeholder="Max attendees"
                value={formData.capacity}
                onChange={handleInputChange}
                required 
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label flex items-center gap-2"><MapPin size={16} /> Location</label>
            <input 
              name="location"
              type="text" 
              className="form-control" 
              placeholder="Venue name or city"
              value={formData.location}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              className="form-control" 
              rows="5"
              placeholder="Describe what your event is about..."
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              {saving ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : 
               <><Save size={20} /> {isEdit ? 'Update Event' : 'Create Event'}</>}
            </button>
            <button type="button" onClick={() => navigate('/events')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormPage;
