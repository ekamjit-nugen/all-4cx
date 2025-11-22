import React from "react";
import { FormControl, Select, MenuItem, InputLabel, Box } from "@mui/material";

export default function DataTypeDropdown({ dataType, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        paddingX: 10,
        alignItems: "center",
      }}
    >
      <FormControl variant="outlined" sx={{ minWidth: 100, maxWidth: 300 }}>
        <InputLabel shrink sx={{ backgroundColor: "white", fontSize: "16px" }} id="data-type-label">
          Data Type
        </InputLabel>
        <Select
          labelId="data-type-label"
          value={dataType}
          onChange={handleChange}
          label="Data Type"
          sx={{ fontSize: "14px", padding: "10px", width: 400 }}
          InputLabelProps={{ style: { backgroundColor: "white" } }}
        >
          {/* <MenuItem value="plugin">Plugin</MenuItem> */}
          <MenuItem value="file">File</MenuItem>
          <MenuItem value="folder">Folder</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
