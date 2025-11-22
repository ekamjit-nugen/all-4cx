import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { Handle, Position } from "@xyflow/react";

const SearchNode = ({ isConnectable, onRemoveNode, onValueChange, selectedValue }) => {
  const [closeComponent, setCloseComponent] = useState(true);
  const [selectedOption, setSelectedOption] = useState(selectedValue || null);

  const handleClose = () => {
    setCloseComponent(false);
    onRemoveNode();
  };

  const handleValueChange = (event, newValue) => {
    setSelectedOption(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  useEffect(() => {
    setSelectedOption(selectedValue);
  }, [selectedValue]);

  const options = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ];

  return closeComponent ? (
    <Box
      sx={{
        padding: 1,
        border: "2px solid #0588cd",
        borderRadius: 2,
        width: 200,
        background: "white",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <MoreHorizIcon
          sx={{
            height: "8px",
            width: "8px",
            color: "gray",
            stroke: "gray",
            strokeWidth: 1,
            backgroundColor: "none",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontSize: "10px", fontWeight: "700" }}>Search Node</Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(173, 216, 230, 0.3)",
              borderRadius: "50%",
              transform: "scale(0.8)",
            },
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <CloseIcon
            sx={{
              height: "12px",
              width: "12px",
              color: "#0588cd",
              stroke: "#0588cd",
              strokeWidth: 1,
              backgroundColor: "none",
            }}
          />
        </IconButton>
      </Box>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        value={selectedOption}
        onChange={handleValueChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder="Select Search"
            fullWidth
          />
        )}
        sx={{
          marginTop: 1,
          fontSize: "10px !important",
          "& .MuiInputBase-input": {
            fontSize: "10px !important",
          },
          "& .MuiInputBase-root": {
            padding: "5px !important",
          },
          "& .MuiOutlinedInput-root": {
            padding: "5px !important",
          },
        }}
      />
      <Typography sx={{ marginTop: 1, fontSize: "12px", color: "black" }}>
        Selected: {selectedOption ? selectedOption.label : "None"}
      </Typography>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </Box>
  ) : null;
};

export default SearchNode;
