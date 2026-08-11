import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventFormPage from './pages/EventFormPage';
import OrganizersPage from './pages/OrganizersPage';
import OrganizerDetailPage from './pages/OrganizerDetailPage';
import OrganizerFormPage from './pages/OrganizerFormPage';
import AttendeesPage from './pages/AttendeesPage';
import AttendeeDetailPage from './pages/AttendeeDetailPage';
import AttendeeFormPage from './pages/AttendeeFormPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            
            {/* Organizer/Admin Protected Routes */}
            <Route path="/events/new" element={
              <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                <EventFormPage />
              </ProtectedRoute>
            } />
            <Route path="/events/:id/edit" element={
              <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                <EventFormPage />
              </ProtectedRoute>
            } />
            
            <Route path="/organizers" element={
              <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                <OrganizersPage />
              </ProtectedRoute>
            } />
            <Route path="/organizers/:id" element={
              <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                <OrganizerDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/organizers/:id/edit" element={
              <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                <OrganizerFormPage />
              </ProtectedRoute>
            } />

            {/* Admin Only Protected Routes */}
            <Route path="/attendees" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AttendeesPage />
              </ProtectedRoute>
            } />

            {/* Admin or Self Protected Routes */}
            <Route path="/attendees/:id" element={
              <ProtectedRoute allowedRoles={['Admin', 'Attendee']}>
                <AttendeeDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/attendees/:id/edit" element={
              <ProtectedRoute allowedRoles={['Admin', 'Attendee']}>
                <AttendeeFormPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
