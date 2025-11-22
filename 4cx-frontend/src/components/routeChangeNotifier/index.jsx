import PopupModal from "components/pop-modal";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import fetchData from "services/api";
import { updateIndexId } from "store/features/projectIdSlice";
import { updateNavigationPath } from "store/features/projectIdSlice";
import { updateRetrievalCallHandleSave } from "store/features/retrievalSlice";
import { updateRetrievalUnSaveChanges } from "store/features/retrievalSlice";
import { updateCallHandleSave } from "store/features/searchSlice";
import { updateUnSaveChanges } from "store/features/searchSlice";

const RouteChangeNotifier = () => {
  const location = useLocation();
  const searchUnSaveChanges = useSelector((state) => state.searchFlow.unSaveChanges);
  const retrievalUnSaveChanges = useSelector((state) => state.retrieval.unSaveChanges);
  const dispatch = useDispatch();
  const projectId = useSelector((state) => state.projectIdList);
  const searchRedux = useSelector((state) => state.searchFlow);
  const retrievalRedux = useSelector((state) => state.retrieval);
  const [isSaveModal, setIsSaveModal] = useState({
    state: false,
    data: "",
  });
  const navigationPath = useSelector((state) => state.projectIdList.navigationPath);
  const navigate = useNavigate();
  const handelSaveModal = (data) => {
    if (data.state === false) {
      setIsSaveModal({
        ...data,
        state: false,
      });
    } else if (data.state === true) {
      setIsSaveModal({
        ...data,
        state: false,
      });
      handleSaveSearchData();
    }
  };

  const handleSaveSearchData = async () => {
    const payload = {
      jsonData: searchRedux.flowJsonData,
      name: searchRedux.name,
    };

    try {
      let response = await fetchData(
        `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/save`,
        "POST",
        payload
      );
      dispatch(updateIndexId(response?.data?._id));

      toast.success(response?.message);
      setIsSaveModal((prev) => ({ ...prev, state: false }));
      navigate(navigationPath);
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handleSaveRetrievalData = async () => {
    try {
      const payload = {
        indexId: projectId.indexId,
        jsonData: retrievalRedux,
        name: retrievalRedux?.name,
      };
      if (payload.jsonData) {
        let response = await fetchData(
          `search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/retrieval/data`,
          "POST",
          payload
        );
        if (response?.message) {
          toast.success(response?.message);
          setIsSaveModal((prev) => ({ ...prev, state: false }));
          dispatch(updateRetrievalCallHandleSave(false));
          navigate(navigationPath);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (navigationPath?.length) {
      const handleRouteChange = async () => {
        const message =
          "You have unsaved changes. Click 'OK' to save your changes, or 'Cancel' to discard them and continue navigating.";

        const value = window.confirm(message);

        if (!value) {
          dispatch(updateUnSaveChanges(false));
          setIsSaveModal({
            ...isSaveModal,
            state: false,
          });
        }

        if (searchUnSaveChanges) {
          if (value) {
            if (!retrievalUnSaveChanges && searchRedux?.name === "") {
              setIsSaveModal({
                ...isSaveModal,
                state: true,
              });
            }
            await handleSaveSearchData();
          } else {
            navigate(navigationPath);
          }
          dispatch(updateUnSaveChanges(false));
          dispatch(updateCallHandleSave(value));
        }
        if (retrievalUnSaveChanges) {
          if (value) {
            await handleSaveRetrievalData();
          } else {
            navigate(navigationPath);
          }
          dispatch(updateRetrievalUnSaveChanges(false));
          dispatch(updateRetrievalCallHandleSave(value));
        }
      };

      // main
      if (searchUnSaveChanges || retrievalUnSaveChanges) {
        handleRouteChange();
      }
    }
  }, [navigationPath]);

  useEffect(() => {
    dispatch(updateNavigationPath(location));
  }, [location]);

  return isSaveModal.state === true ? (
    <PopupModal type="input" isOpen={handelSaveModal} title="Save Data Source Flow" />
  ) : null;
};

export default RouteChangeNotifier;
