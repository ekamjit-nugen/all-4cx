import { UploadProvider } from "../add-source/upload-context";
import React from "react";
import DataType from "../tab-Component";
import { Card } from "@mui/material";

const AddDataSourceComponent = () => {
  return (
    <UploadProvider>
      <Card sx={{height:"auto",paddingY:3,paddingX:5}}>
        <DataType />  
      </Card>
    </UploadProvider>
  );
};

export default AddDataSourceComponent;
