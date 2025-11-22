import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { setSelectedComponentName } from 'store/features/projectIdSlice';

function BasicSelect({source , handleChange}) {
  const dispatch = useDispatch()

  React.useEffect(()=> {
    dispatch(setSelectedComponentName(source))
  },[source])

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={source}
          label="Source"
          onChange={handleChange}
        >
        <MenuItem value="Select" disabled>
            <em>Select Component</em>
          </MenuItem>
          <MenuItem value={"component"}>Component</MenuItem>
          <MenuItem value={"chatBot"}>ChatBot</MenuItem>
          <MenuItem value={"search"}>Search</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default BasicSelect
