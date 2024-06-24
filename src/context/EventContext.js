import React, { createContext, useReducer, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';
import mockData from '../components/data.json';

const initialState = {
  user: null,
  isAuthenticated: false,
  featuredEvents: [],
  myEvents: [],
  activities: [],
  notifications: [],
  messages: [],
  analytics: {},
  settings: {},
  joinedEvents: [],
  createdEvents: [],
  participants: [],
  profile: {},
  nonCreatedEvents: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'logout':
      return { ...state, user: null, isAuthenticated: false };
    case 'set_featured_events':
      return { ...state, featuredEvents: action.payload };
    case 'set_my_events':
      return { ...state, myEvents: action.payload };
    case 'set_user':
      return { ...state, user: action.payload };
    case 'set_activities':
      return { ...state, activities: action.payload };
    case 'set_analytics':
      return { ...state, analytics: action.payload };
    case 'set_messages':
      return { ...state, messages: action.payload };
    case 'set_notifications':
      return { ...state, notifications: action.payload };
    case 'set_participants':
      return { ...state, participants: action.payload };
    case 'set_profile':
      return { ...state, profile: action.payload };
    case 'update_settings':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'join_event':
      return {
        ...state,
        joinedEvents: [...state.joinedEvents, action.payload],
      };
    case 'leave_event':
      return {
        ...state,
        joinedEvents: state.joinedEvents.filter((id) => id !== action.payload),
      };
    case 'create_event':
      return { ...state, createdEvents: [...state.createdEvents, action.payload] };
    case 'set_non_created_events':
      return { ...state, nonCreatedEvents: action.payload };
    default:
      return state;
  }
}

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          dispatch({ type: 'set_user', payload: response.data.data });
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    const fetchHighRatedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/high-rated', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && response.data.success) {
          dispatch({ type: 'set_featured_events', payload: response.data.data });
        }
      } catch (err) {
        console.error('Error fetching high-rated events:', err);
      }
    };

    fetchUserInfo();
    fetchHighRatedEvents();
    dispatch({ type: 'set_my_events', payload: mockData.myEvents.upcoming });
    dispatch({ type: 'set_activities', payload: mockData.activities });
    dispatch({ type: 'set_analytics', payload: mockData.analytics });
    dispatch({ type: 'set_messages', payload: mockData.messages });
    dispatch({ type: 'set_notifications', payload: mockData.notifications });
    dispatch({ type: 'set_participants', payload: mockData.participants });
    dispatch({ type: 'set_profile', payload: mockData.profile });
    dispatch({ type: 'update_settings', payload: mockData.settings });
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
