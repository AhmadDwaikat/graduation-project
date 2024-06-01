import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Import the Header component
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/LogIn';
import Dashboard from './components/Dashboard';
import EventCreation from './components/EventCreation';
import EventDetail from './components/EventDetail';
import ParticipantManagement from './components/ParticipantManagement';
import Profile from './components/Profile';
import ActivityLibrary from './components/ActivityLibrary';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { EventProvider } from './context/EventContext'; // Import the EventProvider

const App = () => {
  return (
    <Router>
      <EventProvider> {/* Wrap the entire app or part of it with EventProvider */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event-creation" element={<EventCreation />} />
          <Route path="/event-detail/:id" element={<EventDetail />} />
          <Route path="/participant-management" element={<ParticipantManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity-library" element={<ActivityLibrary />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </EventProvider>
    </Router>
  );
};

export default App;
