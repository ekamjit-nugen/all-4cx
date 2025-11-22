import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  useMediaQuery,
} from "@mui/material";

const UploadList = ({ uploadedFiles }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [openFolders, setOpenFolders] = useState({});
  
  const rows = uploadedFiles
    ? uploadedFiles
        .filter((file) => typeof file !== "string")
        .map((file) => ({
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
          type: file.type,
          folder: file.webkitRelativePath ? file.webkitRelativePath.split("/")[0] : null,
        }))
    : [];

  const folders = rows.reduce((acc, file) => {
    if (file.folder) {
      if (!acc[file.folder]) {
        acc[file.folder] = [];
      }
      acc[file.folder].push(file);
    } else {
      if (!acc["individualFiles"]) {
        acc["individualFiles"] = [];
      }
      acc["individualFiles"].push(file);
    }
    return acc;
  }, {});

  const handleFolderToggle = (folderName) => {
    setOpenFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const calculateTotalSize = (files) => {
    let totalSize = 0;
    files.forEach((file) => {
      totalSize += parseFloat(file.size.replace(" KB", ""));
    });
    return totalSize.toFixed(2) + " KB";
  };

  return (
    <Box width={"100%"} mt={5}>
      <Typography sx={{ fontSize: "18px", fontWeight: "bold", color: "#404040" }}>
        Upload list
      </Typography>
      <Box borderBottom={1} sx={{ borderColor: "grey.400" }}></Box>
      {uploadedFiles?.length > 0 ? (
        <Paper sx={{ mt: 2, width: "auto" }}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>File Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Size
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Location/Type
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                {folders.individualFiles &&
                  folders.individualFiles.map((file, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        sx={{
                          whiteSpace: isSmallScreen ? "nowrap" : "normal",
                          overflow: isSmallScreen ? "hidden" : "visible",
                          textOverflow: isSmallScreen ? "ellipsis" : "clip",
                          maxWidth: isSmallScreen ? "80px" : "auto",
                        }}
                      >
                        {file.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: isSmallScreen ? "hidden" : "visible",
                          textOverflow: isSmallScreen ? "ellipsis" : "clip",
                          maxWidth: isSmallScreen ? "100px" : "auto",
                        }}
                      >
                        {file.size}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          whiteSpace: isSmallScreen ? "nowrap" : "normal",
                          overflow: isSmallScreen ? "hidden" : "visible",
                          textOverflow: isSmallScreen ? "ellipsis" : "clip",
                          maxWidth: isSmallScreen ? "150px" : "auto",
                        }}
                      >
                        {file.type}
                      </TableCell>
                    </TableRow>
                  ))}
                {Object.keys(folders).map((folderName, index) =>
                  folderName !== "individualFiles" ? (
                    <React.Fragment key={index}>
                      {/* <TableRow>
                        <TableCell colSpan={3}>
                          <Box display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              onClick={() => handleFolderToggle(folderName)}
                            >
                              {openFolders[folderName] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                            <Typography sx={{ fontWeight: "bold" }}>{folderName}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow> */}
                      <TableRow
                        key={index}
                        onClick={() => handleFolderToggle(folderName)}
                        sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell colSpan={3}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography sx={{ fontWeight: "bold" }}>{folderName}</Typography>
                            <Typography
                              sx={{
                                marginLeft: "10px",
                                color: "#666",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              Total Size: {calculateTotalSize(folders[folderName])}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                          <Collapse in={openFolders[folderName]} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                              <Table size="small">
                                <TableBody>
                                  {folders[folderName].map((file, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell
                                        sx={{
                                          whiteSpace: isSmallScreen ? "nowrap" : "normal",
                                          overflow: isSmallScreen ? "hidden" : "visible",
                                          textOverflow: isSmallScreen ? "ellipsis" : "clip",
                                          maxWidth: isSmallScreen ? "80px" : "auto",
                                          fontSize: "14px",
                                          padding: "0px",
                                          width: "48%",
                                        }}
                                      >
                                        {file.name}
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        sx={{
                                          whiteSpace: "nowrap",
                                          overflow: isSmallScreen ? "hidden" : "visible",
                                          textOverflow: isSmallScreen ? "ellipsis" : "clip",
                                          maxWidth: isSmallScreen ? "100px" : "auto",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {file.size}
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{
                                          whiteSpace: isSmallScreen ? "nowrap" : "normal",
                                          overflow: isSmallScreen ? "hidden" : "visible",
                                          textOverflow: isSmallScreen ? "ellipsis" : "clip",
                                          maxWidth: isSmallScreen ? "150px" : "auto",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {file.type}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ) : null
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography
            sx={{
              fontStyle: "italic",
              textAlign: "center",
              color: "grey.600",
              fontSize: "15px",
            }}
          >
            File Types supported are (txt, html, pdf, md, docx, xs/x, jpg, png, mp3, wav, mp4)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UploadList;