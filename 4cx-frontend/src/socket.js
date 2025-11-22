import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import Box from "@mui/material/Box";
import SoftButton from "components/soft-button";
import LinearWithValueLabel from "assets/theme/components/linearProgressWithLabel";
import { useDispatch } from "react-redux";
import { setExtractFile } from "store/features/socketSlice";
import { completeUpload } from "store/features/fileUploadSlice";

const ProgressBar = ({ resetProgress }) => {
  const socketRef = useRef(null);
  const socketUrl = process.env.REACT_APP_BASE_URL_SOCKET;
  const [progress, setProgress] = useState({ progressed: 0, total: 1 });
  const [fileProcess, setFileProcess] = useState(0);
  const dispatch = useDispatch();

  const callSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.on("url-scraping", (args) => {
        setProgress({ progressed: args.processed, total: args.total });
        if (args.data) {
          dispatch(setExtractFile(args.data));
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl);
      callSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [callSocket, socketUrl]);

  useEffect(() => {
    const percent =
      progress.total && progress.progressed
        ? Math.floor((progress.progressed / progress.total) * 100)
        : 0;
    setFileProcess(percent);
  }, [progress]);

  useEffect(() => {
    if (fileProcess === 100 && socketRef.current) {
      const timeout = setTimeout(() => {
        resetProgress();
        socketRef.current.disconnect();
        socketRef.current = null;
        dispatch(completeUpload());
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [fileProcess, resetProgress]);

  if (fileProcess === 100) {
    return (
      <SoftButton
        fullWidth
        disabled
        startIcon={<CheckCircleOutlineTwoToneIcon style={{ color: "#52c41a" }} />}
      >
        Processed
      </SoftButton>
    );
  } else {
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", ml: 1 }}>
            <LinearWithValueLabel value={fileProcess} />
          </Box>
        </Box>
      </Box>
    );
  }
};

export default ProgressBar;
