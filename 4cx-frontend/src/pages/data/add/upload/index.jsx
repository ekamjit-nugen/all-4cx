import fetchData from "services/api";
import { toast } from "react-toastify";
import UploadList from "../upload-list";
import SoftBox from "components/soft-box";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import SoftButton from "components/soft-button";
import React, { useContext, useRef, useState } from "react";
import UploadContext from "pages/data/add-source/upload-context";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";

const UploadComponent = () => {
  const { uploadedFiles, setUploadedFiles, folderFiles, setFolderFiles } =
    useContext(UploadContext);
  const { userId, orgId } = useAuth();
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingFolder, setIsUploadingFolder] = useState(false);
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files?.length === 0) return;

    if (uploadedFiles.length > 0 || folderFiles.length > 0) {
      alert("You can only upload one file or folder at a time.");
      return;
    }

    const allowedFileTypes = [
      "text/plain", // .txt
      "text/html", // .html
      "application/pdf", // .pdf
      "text/markdown", // .md
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "image/jpeg", // .jpg
      "image/png", // .png
      "audio/mpeg", // .mp3
      "audio/wav", // .wav
      "video/mp4", // .mp4
    ];

    const newFiles = Array.from(files).filter((file) => allowedFileTypes.includes(file.type));

    if (newFiles.length > 0) {
      setUploadedFiles(newFiles);
      setIsUploadingFile(true);
    }
  };

  const handleFolderUpload = (event) => {
    const files = event.target.files;
    if (!files || files?.length === 0) return;

    if (uploadedFiles.length > 0 || folderFiles.length > 0) {
      alert("You can only upload one file or folder at a time.");
      return;
    }

    const newFolderFiles = Array.from(files);
    const folderName = newFolderFiles[0].webkitRelativePath.split("/")[0];
    const folderPaths = newFolderFiles.map((file) => file.webkitRelativePath);
    setFolderFiles(newFolderFiles);
    setIsUploadingFolder(true);
  };

  const handleUploadButtonClick = async () => {
    if (uploadedFiles.length === 0 && folderFiles.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    const folderName =
      folderFiles.length > 0 ? folderFiles[0].webkitRelativePath.split("/")[0] : null;
    const folderPaths = folderFiles.map((file) => file.webkitRelativePath);

    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    folderFiles.forEach((file) => {
      formData.append("files", file);
    });

    if (folderName) {
      formData.append("folderName", folderName);
      formData.append("folderPaths", JSON.stringify(folderPaths));
    }

    formData.append("userId", userId);
    formData.append("projectId", projectId);
    formData.append("organizationId", orgId);
    try {
      const data = await fetchData("upload/file", "POST", formData);
      setUploadedFiles([]);
      setFolderFiles([]);
      toast.success("Files uploaded successfully");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (folderInputRef.current) {
        folderInputRef.current.value = "";
      }
      setIsUploadingFile(false);
      setIsUploadingFolder(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(error.message);
      setIsUploadingFile(false);
      setIsUploadingFolder(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="grid" width={"auto"} alignItems="start" mr={2} mt={10}>
      <Box
        display="flex"
        flexDirection={isMediumScreen ? "column" : "row"}
        gap={isMediumScreen ? "16px" : "50px"}
        alignItems={isMediumScreen ? "center" : "start"}
      >
        <Button
          component="label"
          htmlFor="file-upload"
          sx={{
            height: isMediumScreen ? "100px" : "180px",
            width: isMediumScreen ? "200px" : "350px",
            borderColor: "grey.300",
            marginRight: isMediumScreen ? "0px" : "8px",
            color: "#404040",
            borderStyle: "solid",
            borderWidth: "1px",
          }}
          disabled={loading || isUploadingFile || isUploadingFolder}
        >
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            accept=".txt, .html, .pdf, .md, .docx, .xlsx, .jpg, .png, .mp3, .wav, .mp4"
            multiple
            onChange={handleFileUpload}
          />
          <Typography sx={{ fontWeight: "bold" }} variant="body2">
            {isUploadingFile ? "Uploading..." : "Upload File"}
          </Typography>
        </Button>

        <Button
          component="label"
          htmlFor="folder-upload"
          sx={{
            height: isMediumScreen ? "100px" : "180px",
            width: isMediumScreen ? "200px" : "350px",
            borderColor: "grey.300",
            marginRight: isMediumScreen ? "0px" : "8px",
            color: "#404040",
            borderStyle: "solid",
            borderWidth: "1px",
          }}
          disabled={loading || isUploadingFile || isUploadingFolder}
        >
          <input
            id="folder-upload"
            ref={folderInputRef}
            type="file"
            style={{ display: "none" }}
            multiple
            onChange={handleFolderUpload}
            webkitdirectory=""
          />
          <Typography sx={{ fontWeight: "bold" }} variant="body2">
            {isUploadingFolder ? "Uploading..." : "Upload Folder"}
          </Typography>
        </Button>
      </Box>
      <UploadList uploadedFiles={[...uploadedFiles, ...folderFiles]} />
      <SoftBox
        width={{ xs: "100%", sm: "40%" }}
        mt={2}
        sx={{ textAlign: isMediumScreen ? "center" : "left" }}
      >
        <SoftButton variant="gradient" color="dark" onClick={handleUploadButtonClick}>
          Upload
        </SoftButton>
      </SoftBox>
    </Box>
  );
};

export default UploadComponent;
