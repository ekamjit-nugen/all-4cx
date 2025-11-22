import React from "react";
import { Chip, Paper } from "@mui/material";
import DataTable from "./data-table";

// Define columns for the table
const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "origin", headerName: "Origin" },
  { field: "description", headerName: "Description", flex: 4 },
  {
    field: "filter",
    headerName: "Filter",
    flex: 2,
    renderCell: (params) => (
      <Chip
        label={params.value}
        onClick={() => handleFilterClick(params.row.fields)}
        variant="outlined"
        sx={{ cursor: "pointer" }}
      />
    ),
  },
];

// Define rows (data)
const rows = [
  {
    id: 0,
    name: "Title",
    origin: "string",
    isSelected: true,
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    filter: "",
  },
  {
    id: 1,
    name: "Content",
    origin: "array",
    isSelected: true,
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    filter: "",
  },
  {
    id: 2,
    name: "Summary",
    origin: "string",
    isSelected: true,
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    filter: "",
  },
  {
    id: 3,
    name: "Entities",
    origin: "array",
    isSelected: true,
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    filter: "",
  },
  {
    id: 4,
    name: "Keywords",
    origin: "string",
    isSelected: true,
    description: "lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    filter: "",
  },
];

// Function to handle filter click (dummy function)
const handleFilterClick = (field) => {
  console.log("Filter clicked for:", field);
};

export default function ApplyFilterComponent() {
  return (
    <DataTable
      data={rows} // Pass the data (rows)
      columns={columns} // Pass the columns
      isLoading={false} // Assuming no loading needed in this component
      updatePayload={() => {}} // Placeholder for payload update logic
    />
  );
}
