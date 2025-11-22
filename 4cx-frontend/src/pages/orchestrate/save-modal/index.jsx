import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Input } from "@mui/material";
import { useState } from "react";
import SoftButton from "components/soft-button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  Background: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SaveModal({ handleCloseSave, handleOnSaveButton }) {
  const [input, setInput] = useState();
  const [category, setCategory] = useState();


  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        paddingY: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "end", paddingX: 2 }}>
        <SoftButton
          variant="none"
          sx={{ width: "10%", display: "flex", textAlign: "end", color: "lightslategray" }}
          onClick={() => handleCloseSave()}
        >
          x
        </SoftButton>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, paddingX: 5 }}>
        <Typography
          sx={{ textAlign: "center", fontWeight: 700, fontSize: 30, color: "lightslategray" }}
        >
          Save Flow
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Input
            sx={{
              "& .MuiInputBase-input": {
                width: "100% !important",
              },
            }}
            placeholder="Enter Flow Name"
            onChange={(e) => setInput(e?.target?.value)}
          />
           <Input
            sx={{
              "& .MuiInputBase-input": {
                width: "100% !important",
              },
            }}
            placeholder="Enter Category Name"
            onChange={(e) => setCategory(e?.target?.value)}
          />
          <SoftButton
            variant="gradient"
            color="dark"
            onClick={() => handleOnSaveButton({input,category}, true)}
          >
            Save
          </SoftButton>
        </Box>
      </Box>
    </Box>
  );
}
