import React from "react";
import {
  Box,
  Modal,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
} from "@mui/material";
import SoftButton from "components/soft-button";
import useClipboard from "utils/use-clipboard";

const ExcelModal = ({
  open,
  onClose,
  urls,
  page,
  rowsPerPage,
  onChangePage,
  urlCount,
  onUpload,
}) => {
  const { handleCopyToClipboard } = useClipboard();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Confirm Extraction
        </Typography>
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mt: 2, fontSize: "15px" }}>
          Are you sure you want to extract data from the entered URL?
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>URLs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls &&
                urls
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((url, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleCopyToClipboard(url)}
                      >
                        {url}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={urls ? urls.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
        />
        <Typography sx={{ mt: 2, fontSize: "15px", fontWeight: "500" }}>
          Total URLs: {urlCount}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <SoftButton onClick={onClose} variant="outlined" color="dark" sx={{ mr: 1 }}>
            Cancel
          </SoftButton>
          <SoftButton onClick={onUpload} variant="gradient" color="dark">
            Upload
          </SoftButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExcelModal;
