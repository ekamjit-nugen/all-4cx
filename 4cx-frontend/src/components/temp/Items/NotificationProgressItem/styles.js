// styles.js

export const menuItem = (theme) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2), // 1.5 * theme.spacing.unit (usually 4px) for vertical, 2 for horizontal
  borderRadius: theme.shape.borderRadius, // Consistent border radius from theme
  transition: "background-color 0.3s ease", // Smooth background color transition
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // Use theme's hover state color
  },
});

export const menuImage = (theme, { color }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette[color]?.main || theme.palette.grey[500], // Fallback to grey if invalid color
  color: theme.palette.common.white, // Text color inside the icon container
  borderRadius: theme.shape.borderRadius, // Consistent border radius
  width: theme.spacing(5.5), // Converted to spacing units (5.5 * 4px = 22px)
  height: theme.spacing(5.5), // Same as width for uniform size
});
