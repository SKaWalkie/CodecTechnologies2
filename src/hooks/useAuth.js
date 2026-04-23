import { useState, useEffect } from 'react';

/**
 * Custom hook for managing simple authentication state using
 * the browser's localStorage. When a user logs in, their
 * details (name, optional avatar URL and an ID) are saved to
 * localStorage under the `auth` key. This hook reads the
 * information on mount and updates it when the `auth` item
 * changes (e.g. in another tab).
 *
 * @returns {Object} An object containing the user name,
 *          optional photo URL, userID and isAuth flag.
 */
export const useAuth = () => {
  // Initialize state based off localStorage or sensible defaults
  const [authInfo, setAuthInfo] = useState(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse auth info from localStorage', e);
      }
    }
    return { name: null, photo: null, userID: null, isAuth: false };
  });

  useEffect(() => {
    // Storage event handler keeps state in sync across tabs
    const handleStorage = (event) => {
      if (event.key === 'auth') {
        if (event.newValue) {
          try {
            setAuthInfo(JSON.parse(event.newValue));
          } catch (e) {
            console.error('Failed to parse auth info from localStorage', e);
          }
        } else {
          setAuthInfo({ name: null, photo: null, userID: null, isAuth: false });
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return authInfo;
};