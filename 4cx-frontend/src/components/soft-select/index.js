/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import colors from "assets/theme/base/colors";
import styles from "./styles";

const SoftSelect = forwardRef(({ size, error, success, value, defaultValue, ...rest }, ref) => {
  const { light } = colors;

  // Ensure value and defaultValue are either objects or undefined
  const safeValue = value || undefined;
  const safeDefaultValue = defaultValue || undefined;

  // Determine if the select should be disabled
  const isDisabled = !safeValue && !safeDefaultValue;

  return (
    <Select
      {...rest}
      ref={ref}
      value={safeValue}
      defaultValue={safeDefaultValue}
      styles={styles(size, error, success)}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: light.main,
          primary: light.main,
        },
      })}
      isDisabled={isDisabled} // Set the disabled prop based on the logic
    />
  );
});

// Setting default values for the props of SoftSelect
SoftSelect.defaultProps = {
  size: "medium",
  error: false,
  success: false,
  value: null,
  defaultValue: null,
};

// Typechecking props for the SoftSelect
SoftSelect.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  error: PropTypes.bool,
  success: PropTypes.bool,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
};

export default SoftSelect;
