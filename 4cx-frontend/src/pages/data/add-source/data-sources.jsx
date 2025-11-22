import { Card } from "@mui/material";
import React from "react";
import DataTable from "./data-sources-table";

const DataSourceComponent = () => {
  return (
    <Card sx={{paddingX:1,paddingY:4}}>
      <DataTable />
    </Card>
  );
};

export default DataSourceComponent;
