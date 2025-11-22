import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import SoftButton from "components/soft-button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateFlowJsonData } from "store/features/searchSlice";
import { initialSearchReduxData } from "pages/search/const";
import { updateRetrievalJson } from "store/features/retrievalSlice";
import { initialRetrievalReduxData } from "pages/search/const";
import { updateSearchCreateNew } from "store/features/searchSlice";
import { updateRetrievalCreateNew } from "store/features/retrievalSlice";
import { resetSearchJson } from "store/features/searchSlice";
import { resetRetrievalJson } from "store/features/retrievalSlice";

function CreateButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleRefresh = async () => {
    setTimeout(() => {
      // Simulate dummy status update
      dispatch(resetSearchJson());
      dispatch(resetRetrievalJson());
      dispatch(updateSearchCreateNew(true));
      dispatch(updateRetrievalCreateNew(true));
      navigate("/aiIndex/general");
      setLoading(false);
    }, 1000);
  };

  return (
    <SoftButton
      variant="gradient"
      color="dark"
      onClick={() => {
        handleRefresh(), setLoading(true);
      }}
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : "Create"}
    </SoftButton>
  );
}

export default CreateButton;
