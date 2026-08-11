import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, UserCircle, LogOut, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-wrap">

            {/* Dragon Ball star sphere */}
            <div className="brand-orb">
              <div className="brand-orb-inner">
                <span className="brand-orb-stars">★ ★</span>
              </div>
            </div>

            {/* Text block */}
            <div className="brand-text-block">
              <span className="brand-text-main">EventHub</span>
            </div>

          </div>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/events" className="nav-link">
                <LayoutDashboard size={18} />
                <span>Events</span>
              </Link>
              
              {(user.role === 'Organizer' || user.role === 'Admin') && (
                <Link to="/organizers" className="nav-link">
                  <Users size={18} />
                  <span>Organizers</span>
                </Link>
              )}
              
              {user.role === 'Admin' && (
                <Link to="/attendees" className="nav-link">
                  <UserCircle size={18} />
                  <span>Attendees</span>
                </Link>
              )}

              <div className="user-profile">
                <span className={`role-badge role-${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
                <span className="user-email">{user.email}</span>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-link btn-register">
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
