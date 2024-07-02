import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/LogIn';
import Dashboard from './components/Dashboard';
import EventCreation from './components/EventCreation';
import EventDetail from './components/EventDetail';
import OrganizerEventDetail from './components/OrganizerEventDetail';
import ParticipantManagement from './components/ParticipantManagement';
import Profile from './components/Profile';
import ActivityLibrary from './components/ActivityLibrary';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import UpdateEvent from './components/UpdateEvent';
import { EventProvider } from './context/EventContext';
import ProtectedRoute from './components/ProtectedRoute';
import ParticipantManagementPage from './components/ParticipantManagement';

const App = () => {
  return (
    <Router>
      <EventProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event-detail/:id" element={<EventDetail />} />
          <Route path="/event-organizer/:id" element={<OrganizerEventDetail />} />
          <Route path="/event/:eventId/participants" element={<ParticipantManagementPage />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-creation"
            element={
              <ProtectedRoute>
                <EventCreation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-detail/:id"
            element={
              <ProtectedRoute>
                <EventDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-update/:id"
            element={
              <ProtectedRoute>
                <UpdateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant-management"
            element={
              <ProtectedRoute>
                <ParticipantManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-library"
            element={
              <ProtectedRoute>
                <ActivityLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </EventProvider>
    </Router>
  );
};

export default App;
