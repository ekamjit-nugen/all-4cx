import React from 'react';
import Icon from '@mui/material/Icon'; // Adjust the import path as needed
import { useSnackbar } from 'hooks/useSnackBar';

function SomeComponent() {
  const { showSnackbar } = useSnackbar();

  const handleShowSnackbar = () => {
    showSnackbar({
      color: 'success',
      icon: <Icon>check_circle</Icon>,
      title: 'Operation Successful',
      dateTime: new Date().toLocaleTimeString(),
      content: 'Your operation was completed successfully.',
    });
  };

  return (
    <div>
      <button onClick={() => handleShowSnackbar()}>Show Success Snackbar</button>
    </div>
  );
}

export default SomeComponent;
