import SoftButton from "components/soft-button";
import React from "react";

const StepButton = ({ onClick, label, color, disabled }) => {
  return (
    <SoftButton
      style={{ width: 200 }}
      variant="gradient"
      disabled={disabled}
      color={color}
      onClick={onClick}
    >
      {label}
    </SoftButton>
  );
};

export default StepButton;
