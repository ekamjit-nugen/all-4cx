import { styled } from "@mui/material/styles";

const SoftTextAreaRoot = styled("textarea")(({ theme, ownerState }) => {
  const { size, error, success, disabled } = ownerState;

  // Size adjustments for small, medium, large
  const sizeStyles = {
    small: {
      fontSize: "12px",
      padding: "8px",
    },
    medium: {
      fontSize: "14px",
      padding: "12px",
    },
    large: {
      fontSize: "16px",
      padding: "16px",
    },
  };

  // Color styles for error, success, and disabled states
  const borderColor = error
    ? theme.palette.error.main
    : success
    ? theme.palette.success.main
    : theme.palette.grey[300];

  const disabledStyles = disabled
    ? {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[500],
        cursor: "not-allowed",
      }
    : {};

  return {
    width: "100%",
    minHeight: "100px",
    resize: "vertical", // Allows vertical resizing only
    borderRadius: "8px",
    border: `1px solid ${borderColor}`,
    outline: "none",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    transition: "border-color 0.3s ease-in-out",
    ...sizeStyles[size],
    ...disabledStyles,

    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
  };
});

export default SoftTextAreaRoot;
