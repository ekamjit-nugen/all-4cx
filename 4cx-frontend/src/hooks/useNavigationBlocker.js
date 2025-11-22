import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useNavigationBlocker = (shouldBlock) => {
  const [pendingLocation, setPendingLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (shouldBlock) {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // For older browsers
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [shouldBlock]);

  const blockNavigation = (nextLocation) => {
    if (shouldBlock) {
      setPendingLocation(nextLocation);
      // Optionally, show your confirmation modal here
      return false; // Block navigation
    }
    return true; // Allow navigation
  };

  const confirmNavigation = () => {
    if (pendingLocation) {
      navigate(pendingLocation);
      setPendingLocation(null);
    }
  };

  return { blockNavigation, confirmNavigation };
};
