import React from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import SoftTypography from "components/soft-typography";

export default function ApplyFilterTable() {
  const [data, setData] = useState([]);

  const handleChange = (event) => {
    setData(event.target.value);
  };

  function createData(field, type, description, filter, dataset) {
    return { field, type, description, filter, dataset };
  }

  const rows = [
    createData(
      "Title",
      "String",
      "Find Information about everything relevant to the business",
      "Add Filter",
      "Product Data"
    ),
    createData(
      "Category",
      "String",
      "Find Information about everything relevant to the business",
      "Add Filter",
      "Product Data"
    ),
    createData(
      "Location",
      "String",
      "Find Information about everything relevant to the business",
      "Add Filter",
      "Product Data"
    ),
    createData(
      "Price",
      "String",
      "Find Information about everything relevant to the business",
      "Add Filter",
      "Product Data"
    ),
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
        padding: "0 1rem",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ width: "50%" }}>
          <SoftTypography sx={{ fontWeight: "bold" }}>Apply Filters</SoftTypography>
          <SoftTypography
            sx={{ fontWeight: "semibold", fontSize: "14px", color: "rgb(148 163 184)" }}
          >
            Apply Filters Data Source
          </SoftTypography>
        </Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={data}
          sx={{ width: "250px", height: "80px" }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ padding: "10px" }}
              size="normal"
              label="Data Source"
              InputLabelProps={{ sx: { fontSize: "14px", textAlign: "center" } }}
            />
          )}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "3rem", padding: "0 2rem" }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <TableContainer sx={{ boxShadow: "none", width: "100%" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "14px" }}>Fields</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "14px" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "14px" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "14px" }}>Filter</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "14px" }}>Dataset</TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.field}>
                    <TableCell>{row.field}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "14px" }}>
                      {row.filter}
                    </TableCell>
                    <TableCell>{row.dataset}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
