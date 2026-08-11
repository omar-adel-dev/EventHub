import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginAttendee = async (email, password) => {
    const res = await authService.loginAttendee({ email, password });
    const userData = { role: 'Attendee', email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return res;
  };

  const loginOrganizer = async (email, password) => {
    const res = await authService.loginOrganizer({ email, password });
    // Note: The backend role might be Organizer or Admin, 
    // but the login endpoint is specifically for organizers.
    // We'll trust the email/response for further role checks if needed.
    const userData = { role: email.includes('admin') ? 'Admin' : 'Organizer', email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginAttendee, loginOrganizer, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
