import { Step, StepLabel, Stepper, useMediaQuery } from "@mui/material";
import React from "react";

export default function ProgressBar({steps,process}) {
    const isLargeScreen = useMediaQuery("(max-width:1600px)");

  return (
    <Stepper
      activeStep={process}
      alternativeLabel
      sx={{ width: "100%", maxWidth: isLargeScreen ? "100%" : "60%", margin: "0 auto" }}
    >
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel
            sx={{
              whiteSpace: "nowrap",
              fontSize: isLargeScreen ? "inherit" : "0.8rem",
            }}
          >
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
