import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

// Import SoftSnackbar component
import SoftSnackbar from '../components/soft-snackbar';

// Create a context for snackbar
const SnackbarContext = createContext();

// Create a provider component
export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    color: 'info',
    icon: null,
    title: '',
    dateTime: '',
    content: '',
    close: () => {},
  });

  const showSnackbar = useCallback((options) => {
    setSnackbar({
      ...options,
      open: true,
      close: () => setSnackbar({ ...snackbar, open: false }),
    });
  }, [snackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.open && (
        <SoftSnackbar
          color={snackbar.color}
          icon={snackbar.icon}
          title={snackbar.title}
          dateTime={snackbar.dateTime}
          content={snackbar.content}
          close={snackbar.close}
        />
      )}
    </SnackbarContext.Provider>
  );
}

SnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use snackbar context
export function useSnackbar() {
  return useContext(SnackbarContext);
}
