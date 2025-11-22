import React from "react";
import { Box, useMediaQuery, Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";
import ApplyFilterTable from "./filters";
import StepButton from "./step-button";
import ChooseDataSource from "./choose-data-source";
import ApplyPrompt from "./apply-prompt";
import QueryProcessing from "./query-processing";
import Final from "./final";
import ProgressBar from "components/progress-bar";

const steps = [
  { label: "Data Source" },
  { label: "Filters" },
  { label: "Prompts" },
  { label: "Query Processing" },
  { label: "Final" },
];

export default function NewSearch() {
  const [process, setProcess] = useState(0);
  const isLargeScreen = useMediaQuery("(max-width:1600px)");

  const handleNext = () => {
    setProcess((prevProcess) => prevProcess + 1);
  };

  const handlePrev = () => {
    setProcess((prevProcess) => prevProcess - 1);
  };

  const handleProcessedComponent = () => {
    switch (process) {
      case 0:
        return (
          <>
            <ChooseDataSource />
            <Box sx={{ display: "flex", justifyContent: "end", marginTop: "2rem" }}>
              <StepButton label="Next" color="dark" onClick={handleNext} />
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <ApplyFilterTable />
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
              <StepButton label="Prev" color="light" onClick={handlePrev} />
              <StepButton label="Next" color="dark" onClick={handleNext} />
            </Box>
          </>
        );

      case 2:
        return (
          <>
            <ApplyPrompt />
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
              <StepButton label="Prev" color="light" onClick={handlePrev} />
              <StepButton label="Next" color="dark" onClick={handleNext} />
            </Box>
          </>
        );

      case 3:
        return (
          <>
            <QueryProcessing />
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
              <StepButton label="Prev" color="light" onClick={handlePrev} />
              <StepButton label="Create" color="dark" onClick={handleNext} />
            </Box>
          </>
        );

      case 4:
        return (
          <>
            <Final />
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
              <StepButton label="Create Widget" color="dark" onClick={handlePrev} />
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
            mt: 10,
          }}
        >
         
         <ProgressBar steps={steps} process={process}/>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 auto",
              width: isLargeScreen ? "90%" : "60%",
              marginTop: "2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                background: "white",
                borderRadius: "1rem",
                padding: "1.5rem 1rem",
                width: "100%",
              }}
            >
              {handleProcessedComponent()}
            </Box>
          </Box>
        </Box>
    </>
  );
}
