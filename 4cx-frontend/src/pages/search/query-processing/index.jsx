import {
  Autocomplete,
  Box,
  CardContent,
  Checkbox,
  FormControlLabel,
  Input,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SoftTypography from "components/soft-typography";
import React, { useState } from "react";

function QueryProcessing() {
  const [query, setQuery] = useState([]);
  const [inputValue, setInputValue] = useState();
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("1090"));

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: isMediumScreen ? "0" : "0 1rem",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "auto" }}>
        <Box sx={{ width: "50%" }}>
          <SoftTypography sx={{ fontWeight: "bold" }}>Process input user query</SoftTypography>
          <SoftTypography
            sx={{ fontWeight: "semibold", fontSize: "14px", color: "rgb(148 163 184)" }}
          >
            Apply transformation to user query
          </SoftTypography>
        </Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={query}
          sx={{ width: isMediumScreen ? "150px" : "250px", height: "80px" }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ padding: "10px" }}
              size="normal"
              label="Product Prompt"
              InputLabelProps={{ sx: { fontSize: "14px", textAlign: "center" } }}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          display: isMediumScreen ? "grid" : "flex",
          justifyContent: "center",
          width: "100%",
          padding: "30px 0px",
          gap: "50px",
        }}
      >
        <Box
          sx={{
            width: isMediumScreen ? "90%" : "40%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Box sx={{ width: "100%", padding: "1rem" }}>
            <Typography sx={{ fontSize: "14px" }}>Add Prefix</Typography>
            <Input
              defaultValue="Buy"
              inputProps={{ "aria-label": "description" }}
              sx={{
                width: "100%",
                borderBottom: "1px solid",
                border: "none",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
            />
          </Box>
          <Box sx={{ width: "100%", padding: "1rem" }}>
            <Typography sx={{ fontSize: "14px" }}>Add Suffix</Typography>
            <Input
              defaultValue="From store"
              inputProps={{ "aria-label": "description" }}
              sx={{
                width: "100%",
                borderBottom: "1px solid",
                border: "none",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
            />
          </Box>
          <Box sx={{ width: "100%", padding: "1rem" }}>
            <Typography sx={{ fontSize: "14px" }}>Limit number of characters</Typography>
            <Input
              defaultValue="100"
              inputProps={{ "aria-label": "description" }}
              sx={{
                width: "100%",
                borderBottom: "1px solid",
                border: "none",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
            />
          </Box>
          <Box sx={{ width: "100%", padding: "1rem" }}>
            <Typography sx={{ fontSize: "14px" }}>Apply regex</Typography>
            <Input
              defaultValue="/[a-b][A-B]+/"
              inputProps={{ "aria-label": "description" }}
              sx={{
                width: "100%",
                borderBottom: "1px solid",
                border: "none",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            height: "250px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: isMediumScreen ? "40px" : "80px",
              justifyContent: "center",
              padding: "0px !important",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography style={{ fontSize: "14px", fontWeight: "500" }}>Input query</Typography>
              <Input
                readOnly
                sx={{
                  width: isMediumScreen ? "250px !important" : "200px !important",
                  "& .MuiInputBase-input": {
                    width: "100% !important",
                  },
                }}
                defaultValue={"iphone 15"}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography style={{ fontSize: "14px", fontWeight: "500" }}>Input query</Typography>
              <Input
                defaultValue={"buy iphone from store"}
                readOnly
                sx={{
                  width: isMediumScreen ? "250px !important" : "200px !important",
                  backgroundColor: "#333860 !important",
                  "& .MuiInputBase-input": {
                    width: "100% !important",

                    color: "white !important",
                    fontWeight: "bold",
                  },
                }}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Box>
          </CardContent>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: "30px" }}>
          <Box
            sx={{
              width: "auto",
              height: "200px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              position: "relative",
              whiteSpace: "nowrap",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "normal",
                marginBottom: "10px",
                position: "absolute",
                top: "-12px",
                left: "30%",
                transform: "translateX(-50%)",
                backgroundColor: "white !important",
                padding: "0 8px",
                zIndex: 1,
              }}
            >
              AI Enrichments
            </Typography>
            <FormControlLabel control={<Checkbox />} label="Enable PII detection" />
            <FormControlLabel control={<Checkbox />} label="Enable translation" />
            <FormControlLabel control={<Checkbox />} label="Generate document question" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default QueryProcessing;
