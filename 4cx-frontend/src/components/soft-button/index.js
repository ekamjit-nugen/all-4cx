/**
=========================================================
* Soft UI Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef } from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import SoftButtonRoot from "components/soft-button/SoftButtonRoot";

const SoftButton = forwardRef(
  ({ color, variant, size, circular, iconOnly, loading, children, ...rest }, ref) => (
    <SoftButtonRoot
      {...rest}
      ref={ref}
      color="primary"
      variant={variant === "gradient" ? "contained" : variant}
      size={size}
      ownerState={{ color, variant, size, circular, iconOnly }}
      disabled={loading || rest.disabled} // Disable button while loading
    >
      {loading ? (
        <CircularProgress
          size={size === "small" ? 16 : size === "large" ? 24 : 20} // Adjust spinner size based on button size
          color="inherit" // Matches the spinner color with the button text
        />
      ) : (
        children
      )}
    </SoftButtonRoot>
  )
);

// Setting default values for the props of SoftButton
SoftButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
  loading: false,
};

// Typechecking props for the SoftButton
SoftButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  loading: PropTypes.bool, // New prop for loading state
  children: PropTypes.node.isRequired,
};

export default SoftButton;
