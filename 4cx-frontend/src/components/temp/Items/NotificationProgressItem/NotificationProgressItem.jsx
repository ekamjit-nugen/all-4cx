import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";

// @mui material components
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box"; // For layout purposes
import Typography from "@mui/material/Typography"; // For displaying progress text

// Soft UI Dashboard PRO React components
import SoftBox from "components/soft-box";
import SoftTypography from "components/soft-typography";

// custom styles for the NotificationItem
import { menuItem, menuImage } from "./styles";
import { useSelector } from "react-redux";
import ProgressBar from "socket";
import { LinearProgress } from "@mui/material";

const NotificationProgressItem = forwardRef(
  (
    { color, image, title, subTitle, time, initialProgress, isProgress,isLinearProgress, onComplete, ...rest },
    ref
  ) => {
    // const [progress, setProgress] = useState(initialProgress);
    const { progress } = useSelector((state) => state.fileUpload);

    useEffect(() => {
      if (progress >= 100 && onComplete) {
        onComplete();
      }
    }, [progress, onComplete]);

    const formatDate = (dateStr) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("en-US", options);
    };

    const formattedTime = formatDate(time);

    return (
      <MenuItem {...rest} ref={ref} sx={(theme) => ({ ...menuItem(theme), width: 'full' })}>
        {/* Icon Container */}
        <SoftBox
          width="2.25rem"
          height="2.25rem"
          mr={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="lg"
          sx={(theme) => menuImage(theme, { color })}
        >
          {image}
        </SoftBox>

        {/* Title and Progress Container */}
        <SoftBox flex={1} display="flex" flexDirection="column">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SoftTypography variant="button" fontWeight="bold" fontSize={12}>
              {title}
            </SoftTypography>
            <Typography sx={{ fontSize: 10 }}>{formattedTime || Date.now()}</Typography>
          </Box>

          {subTitle && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 1,
                alignItems: "center",
              }}
            >
              <SoftTypography variant="button" fontWeight="regular">
                {subTitle?.title?.length > 10
                  ? `${subTitle?.title}`
                  : subTitle?.title}
              </SoftTypography>

              <SoftTypography variant="button" fontWeight="bold" fontSize={12}>
                {subTitle.status}
              </SoftTypography>
            </Box>
          )}

          {/* Progress Bar with Label */}
          <Box display="flex" alignItems="center">
            {isProgress && <ProgressBar resetProgress={() => console.log("object")} />}
          </Box>
          {isLinearProgress && <div className="" style={{overflow: "hidden", marginTop:'5px'}}>
            <LinearProgress color="success"/>
          </div>}
        </SoftBox>
      </MenuItem>
    );
  }
);

// Setting default values for the props of NotificationProgressItem
NotificationProgressItem.defaultProps = {
  color: "dark",
  initialProgress: 0, // Start from 0% progress
  onComplete: null, // No action on complete by default
};

// Typechecking props for the NotificationProgressItem
NotificationProgressItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  image: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  initialProgress: PropTypes.number, // Initial progress value (defaults to 0)
  onComplete: PropTypes.func, // Callback for when progress completes (optional)
};

export default NotificationProgressItem;
