import React, { useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import { useSelector } from "react-redux";
import SoftSnackbar from "components/soft-snackbar";
import useClipboard from "components/utils/use-clipboard";

const UrlList = () => {
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const logs = useSelector((state) => state.projectIdList.extractFile);
  const { handleCopyToClipboard, snackBarOpen, snackBarMessage, closeSnackBar } = useClipboard();

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#2fcc71";
      case "PENDING":
        return "#FFEB3B";
      case "ERROR":
        return "#f44336";
      default:
        return "#000000";
    }
  };

  const handleSnackBarClose = () => {
    closeSnackBar(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleLogs = logs?.slice(startIndex, endIndex);

  return (
    <Box width="100%" mt={5}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#404040" }}>
        Upload List
      </Typography>
      <Box borderBottom={1} sx={{ borderColor: "grey.400", mt: 1 }}></Box>
      {logs && logs.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="url list table">
              <TableBody>
                {visibleLogs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontSize: "14px", textWrap: "nowrap" }}>
                        {log.activity}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box
                        sx={{
                          width: 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography
                          onClick={() => handleCopyToClipboard(log.url)}
                          variant="body1"
                          sx={{ fontSize: "14px", cursor: "pointer" }}
                        >
                          {log.url}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "12px",
                          color: getStatusColor(log.status),
                          fontWeight: "600",
                        }}
                      >
                        {log.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={Math.ceil(logs.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography
          sx={{
            mt: 2,
            fontStyle: "italic",
            textAlign: "center",
            color: "grey.600",
            fontSize: "15px",
          }}
        >
          File Types supported are (txt, html, pdf, md, docx, xs/x, jpg, png, mp3, wav, mp4)
        </Typography>
      )}
      <SoftSnackbar
        color="success"
        icon="check_circle"
        title="Success"
        content={snackBarMessage}
        close={handleSnackBarClose}
        open={snackBarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={handleSnackBarClose}
      />
    </Box>
  );
};

export default UrlList;
