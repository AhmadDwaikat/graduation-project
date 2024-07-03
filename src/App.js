import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import CreateEventHeader from './components/EventCreation/CreateEventHeader';
import ActivityLibraryHeader from './components/ActivityLibrary/ActivityLibraryHeader';
import AnalyticsHeader from './components/Analytics/AnalyticsHeader';
import SettingsHeader from './components/Settings/SettingsHeader';
import EventDetailHeader from './components/EventDetail/EventDetailHeader';
import ProfileHeader from './components/Profile/ProfileHeader';
import EventOrganizerHeader from './components/OrganizerEventDetail/EventOrganizerHeader';
import UpdateEventHeader from './components/UpdateEvent/UpdateEventHeader';
import ParticipantManagementHeader from './components/ParticipantManagement/ParticipantManagementHeader';
import LoginHeader from './components/LogIn/LoginHeader';
import SignupHeader from './components/SignUp/SignupHeader';

const App = () => {
  return (
    <Router>
      <EventProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event-detail/:id" element={<ProtectedRoute><><EventDetailHeader /><EventDetail /></></ProtectedRoute>} />
          <Route path="/event-organizer/:id" element={<ProtectedRoute><><EventOrganizerHeader /><OrganizerEventDetail /></></ProtectedRoute>} />
          <Route path="/event/:eventId/participants" element={<ProtectedRoute><><ParticipantManagementHeader eventId={':eventId'} /><ParticipantManagementPage /></></ProtectedRoute>} />
          <Route path="/signup" element={<><SignupHeader /><SignUp /></>} />
          <Route path="/login" element={<><LoginHeader /><Login /></>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/event-creation" element={<ProtectedRoute><><CreateEventHeader /><EventCreation /></></ProtectedRoute>} />
          <Route path="/activity-library" element={<ProtectedRoute><><ActivityLibraryHeader /><ActivityLibrary /></></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><><AnalyticsHeader /><Analytics /></></ProtectedRoute>} />
          <Route path="/event-update/:id" element={<ProtectedRoute><><UpdateEventHeader eventId={':id'} /><UpdateEvent /></></ProtectedRoute>} />
          <Route path="/participant-management" element={<ProtectedRoute><ParticipantManagement /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><><ProfileHeader /><Profile /></></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><><SettingsHeader /><Settings /></></ProtectedRoute>} />
        </Routes>
      </EventProvider>
    </Router>
  );
};

export default App;
