import { useLocation } from 'react-router-dom';

const useHeaderContent = () => {
  const location = useLocation();

  switch (location.pathname) {
    case '/':
      return { title: '', links: [] };
    case '/login':
    case '/signup':
      return { title: '', links: [{ to: '/', label: 'Home' }] };
    case '/event-creation':
    case '/activity-library':
    case '/analytics':
    case '/profile':
      return { title: '', links: [{ to: '/dashboard', label: 'Dashboard' }] };
    case `/event-detail/${location.pathname.split("/")[2]}`:
      return { title: '', links: [] };
    default:
      return {
        title: 'Social Activity App',
        links: [
          { to: '/notifications', label: 'Notifications' },
          { to: '/messages', label: 'Messages' },
          { to: '/analytics', label: 'Analytics' },
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/activity-library', label: 'Activity Library' },
          { to: '/profile', label: 'Profile' },
          { to: '/settings', label: 'Settings' },
          { to: '/event-creation', label: 'Create Event' },
        ],
      };
  }
};

export default useHeaderContent;
