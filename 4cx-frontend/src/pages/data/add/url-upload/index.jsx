import React, { useCallback, useRef, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
} from "@mui/material";
import SoftBox from "components/soft-box";
import SoftButton from "components/soft-button";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import ProgressBar from "socket";
import UrlList from "../url-list";
import SoftSnackbar from "components/soft-snackbar";
import { useDispatch } from "react-redux";
import { deleteExtractFile } from "store/features/socketSlice";
import fetchData from "services/api";
import useClipboard from "components/utils/use-clipboard";
import FormField from "components/form-field";
import { startUpload } from "store/features/fileUploadSlice";
import { completeUpload } from "store/features/fileUploadSlice";

function UrlUpload() {
  const [url, setUrl] = useState("");
  const [excelUrls, setExcelUrls] = useState({});
  const { userId, orgId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [excelModal, setExcelModal] = useState(false);
  const [webUrlCount, setWebUrlCount] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const { handleCopyToClipboard, snackBarOpen, snackBarMessage, closeSnackBar } = useClipboard();

  const rowsPerPage = 10;
  const fileInputRef = useRef(null);
  const isUrlEmpty = url.trim() === "";
  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSnackBarClose = () => {
    closeSnackBar();
  };

  const handleUrlCount = async () => {
    try {
      setLoading(true);
      const response = await fetchData("data-sources/webUrl", "POST", {
        url: url,
      });
      setWebUrlCount(response.webUrlCount);
      setSitemapUrl(response.url[0]);
      setLoading(false);
      setOpenModal(true);
    } catch (error) {
      setLoading(false);
      console.log("Error getting the URL:", error);
    }
  };

  const handleUpload = async (type = 0) => {
    try {
      setShowProgressBar(true);
      let urls = [];
      if (type === 0) {
        urls = [sitemapUrl];
        setOpenModal(false);
      } else {
        urls = excelUrls.url || [];
        setExcelModal(false);
      }

      // Dispatch startUpload action
      dispatch(startUpload("Uploading Url List"));

      const response = await fetchData("upload/webSourceData", "POST", {
        userId: userId,
        projectId: projectId,
        organizationId: orgId,
        url: urls,
      });

      setUrl("");
      setSitemapUrl("");
    } catch (error) {
      console.error("Error extracting data:", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files;
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file[0]);
        const response = await fetchData("data-sources/webUrl/xl-file", "POST", formData);
        if (response.url) {
          setExcelUrls(response);
          setExcelModal(true);
        }
      } catch (error) {
        console.error("Error uploading Excel file:", error);
      }
    }
  };

  const handleFileInputClick = (event) => {
    dispatch(deleteExtractFile([]));
    fileInputRef.current.click();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenModal = async () => {
    dispatch(deleteExtractFile([]));
    await handleUrlCount();
  };

  const resetProgress = useCallback(() => {
    setShowProgressBar(false);
    dispatch(completeUpload());
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    setExcelModal(false);
    setExcelUrls({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ display: "grid", width: "auto", alignItems: "start" }} mr={2} mt={10}>
      <SoftBox mb={2}>
        <FormField
          type="text"
          label="URL"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </SoftBox>
      <SoftBox
        display="flex"
        gap="12px"
        width={{ xs: "100%", sm: "80%" }}
        mt={{ xs: 2, sm: "auto" }}
      >
        <SoftButton disabled={isUrlEmpty} variant="gradient" color="dark" onClick={handleOpenModal}>
          extract
        </SoftButton>
        <SoftButton variant="gradient" color="dark" onClick={handleFileInputClick}>
          upload url list
        </SoftButton>
      </SoftBox>
      {showProgressBar && <ProgressBar resetProgress={resetProgress} />}
      {loading && (
        <Box
          sx={{ display: "flex", height: "20vh", justifyContent: "center", alignItems: "center" }}
        >
          <CircularProgress />
        </Box>
      )}
      <UrlList />
      <input
        type="file"
        ref={fileInputRef}
        accept=".xls,.xlsx"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Url extract modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
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
          <FormField type="text" label="URL" placeholder="Enter URL" value={sitemapUrl} disabled />
          <Typography sx={{ mt: 2, fontSize: "15px", fontWeight: "500" }}>
            Total URLs: {webUrlCount}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <SoftButton onClick={handleCloseModal} variant="outlined" color="dark" sx={{ mr: 1 }}>
              Cancel
            </SoftButton>
            <SoftButton onClick={() => handleUpload()} variant="gradient" color="dark">
              Upload
            </SoftButton>
          </Box>
        </Box>
      </Modal>

      {/* Excel Modal */}
      <Modal open={excelModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: "auto",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
            overflow: "auto",
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Confirm Extraction
          </Typography>
          <Typography
            id="modal-description"
            variant="h6"
            component="h2"
            sx={{ mt: 2, fontSize: "15px" }}
          >
            Are you sure you want to extract data from the entered URL?
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>URLs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {excelUrls.url &&
                  excelUrls.url
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
            count={excelUrls.url ? excelUrls.url.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
          <Typography sx={{ mt: 2, fontSize: "15px", fontWeight: "500" }}>
            Total URLs: {excelUrls.webUrlCount}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <SoftButton onClick={handleCloseModal} variant="outlined" color="dark" sx={{ mr: 1 }}>
              Cancel
            </SoftButton>
            <SoftButton onClick={() => handleUpload(1)} variant="gradient" color="dark">
              Upload
            </SoftButton>
          </Box>
        </Box>
      </Modal>
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
}

export default UrlUpload;
