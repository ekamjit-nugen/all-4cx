import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const ProjectsList = ({ projectList, selectedProject, selectChange }) => {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={projectList}
      value={selectedProject}
      onChange={(event, newValue) => selectChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ padding: "10px" }}
          size="normal"
          label="Switch To Project"
          InputLabelProps={{ sx: { fontSize: "14px", textAlign: "center" } }}
        />
      )}
    />
  );
};

export default ProjectsList;
