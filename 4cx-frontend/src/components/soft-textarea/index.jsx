import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for SoftTextArea

// Soft UI Dashboard PRO React contexts
import { useSoftUIController, setLayout } from "../context";
import SoftTextAreaRoot from "./SoftTextAreaRoot";

const SoftTextArea = forwardRef(({ rows, size, error, success, disabled, ...rest }, ref) => {
  const [controller] = useSoftUIController();
  const { direction } = controller;

  return (
    <SoftTextAreaRoot
      {...rest}
      ref={ref}
      ownerState={{ size, error, success, direction, disabled }}
      rows={rows}
    />
  );
});

// Setting default values for the props of SoftTextArea
SoftTextArea.defaultProps = {
  rows: 3,
  size: "medium",
  error: false,
  success: false,
  disabled: false,
};

// Typechecking props for the SoftTextArea
SoftTextArea.propTypes = {
  rows: PropTypes.number,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SoftTextArea;
