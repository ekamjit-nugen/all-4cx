import { useState } from 'react';

const useClipboard = () => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const handleCopyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackBarMessage("Copied to clipboard!");
        setSnackBarOpen(true);
      })
      .catch(() => {
        setSnackBarMessage("Failed to copy!");
        setSnackBarOpen(true);
      });
  };

  const closeSnackBar = () => {
    setSnackBarOpen(false);
  };

  return {
    handleCopyToClipboard,
    snackBarOpen,
    snackBarMessage,
    closeSnackBar,
  };
};

export default useClipboard;
