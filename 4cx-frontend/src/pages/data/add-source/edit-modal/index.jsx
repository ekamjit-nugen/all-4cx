import fetchData from "services/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import SoftButton from "components/soft-button";
import BasicSelect from "pages/data/add/data-source";
import React, { useState, useEffect, useRef } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Modal, Box, Typography, Input } from "@mui/material";

const EditModal = ({ open, handleClose, rowData, saveButton, handleSuccess }) => {
  const { userId } = useAuth();
  const fileInputRef = useRef(null);
  const [fileData, setFileData] = useState();
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState("Select");
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const componentName = useSelector((state) => state.projectIdList.selectEditComponent);

  useEffect(() => {
    if (rowData) {
      setFileName(rowData.file_name || "");
    }
  }, [rowData]);

  const handleChange = (event) => {
    setSource(event.target.value);
  };

  const handleSaveClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileData = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      setFileName(file.name);
    }
    setFileData(file);
  };

  const handleFileChange = async () => {
    if (rowData?.data_type === "file") {
      const formData = new FormData();
      formData.append("file", fileData);
      formData.append("dataSourceId", rowData._id);
      formData.append("userId", userId);
      formData.append("projectId", projectId);
      formData.append("component", componentName);
      formData.append("fileName", fileName);
      formData.append("fileType", fileData.type);

      try {
        await fetchData("upload/file", "PUT", formData, true);
        handleSuccess(fileName)
        handleClose();
      } catch (error) {
        console.error("Error editing file:", error);
        toast.error("Error editing file");
      }
    }
  };

  if (!rowData) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyles }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Edit File Details</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "13px", padding: "0px 10px" }}>Edit File</Typography>
            <FileUploadIcon sx={{ cursor: "pointer" }} onClick={handleSaveClick} />
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileData}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            File Name
          </Typography>
          <Box>
            <Input
              sx={{
                width: "100%",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
              variant="body1"
              defaultValue={fileName}
              onChange={(e)=> setFileName(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Select Component
          </Typography>
          <BasicSelect source={source} handleChange={handleChange} />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Data Retention Policy
          </Typography>
          <Box>
            <Input
              sx={{
                width: "100%",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
              variant="body1"
              value={rowData?.data_retention_policy}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Encryption Enabled
          </Typography>
          <Box>
            <Input
              sx={{
                width: "100%",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
              variant="body1"
              value={rowData?.encryption_enabled}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SoftButton onClick={handleClose} variant="gradient" color="dark" sx={{ mt: 2 }}>
            Close
          </SoftButton>
          <SoftButton onClick={handleFileChange} variant="contained" color="success" sx={{ mt: 2 }}>
            {saveButton}
          </SoftButton>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default EditModal;
