import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import SoftButton from "components/soft-button";
import { useDispatch } from "react-redux";
import { resetSearchJson } from "store/features/searchSlice";
import { resetRetrievalJson } from "store/features/retrievalSlice";
import { useSelector } from "react-redux";

function RefreshButton({ apiCall }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.retrieval);
  const searchReduxData = useSelector((state) => state.searchFlow);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate dummy status update
    dispatch(resetSearchJson());
    dispatch(resetRetrievalJson());
    await apiCall();
    setLoading(false);
  };

  return (
    <SoftButton variant="gradient" color="light" onClick={handleRefresh} disabled={loading}>
      {loading ? <CircularProgress size={24} /> : "Refresh Status"}
    </SoftButton>
  );
}

export default RefreshButton;
