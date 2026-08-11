import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getAll()
      .then(res => setEvents(res.data.slice(0, 3)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <section className="hero" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Where Extraordinary <br />
            <span style={{ color: 'var(--primary)' }}>Events</span> Happen.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Discover, organize, and manage professional events with ease. 
            The all-in-one platform for attendees and organizers.
          </p>
          <div className="flex items-center gap-4" style={{ justifyContent: 'center' }}>
            <Link to="/events" className="btn btn-primary">
              Browse Events <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Join as Organizer
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-events" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="flex justify-between items-center mt-4" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Featured Events</h2>
            <Link to="/events" className="btn-secondary btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center" style={{ justifyContent: 'center', minHeight: '200px' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 grid-cols-3 gap-4">
              {events.map(event => (
                <div key={event.id} className="card">
                  <h3 style={{ marginBottom: '1rem' }}>{event.title}</h3>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users size={16} color="var(--primary)" />
                      <span style={{ fontWeight: '600' }}>{event.registeredCount}/{event.capacity}</span>
                    </div>
                    <Link to={`/events/${event.id}`} className="btn-primary btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
