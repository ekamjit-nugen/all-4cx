import { useState, useEffect, useRef } from "react";
import Icon from "@mui/material/Icon";
import SoftBox from "components/soft-box";
import { useSoftUIController } from "components/context";
import { setOpenConfiguratorNotification } from "components/context";
import NotificationConfigRoot from "./NotificationConfigRoot";
import { LinearProgress, Typography } from "@mui/material";
import NotificationProgressItem from "../NotificationProgressItem/NotificationProgressItem";
import { useSelector } from "react-redux";
import { clearExtractReduxData } from "store/features/socketSlice";
import { useDispatch } from "react-redux";
import fetchData from "services/api";
import { updateDataSource } from "store/features/socketSlice";
import { setNotificationStatus } from "store/features/socketSlice";

function NotificationSidebar() {
  const [controller, dispatch] = useSoftUIController();
  const { OpenConfiguratorNotification } = controller;
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }
    window.addEventListener("resize", handleDisabled);
    handleDisabled();
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);
  const menuButtonRef = useRef(null);
  const handleCloseConfigurator = () => setOpenConfiguratorNotification(dispatch, false);
  const [openMenu, setOpenMenu] = useState(false);
  const handleCloseMenu = () => setOpenMenu(false);
  const promptProcess = useSelector((state) => state.socket.extractPrompt);
  const { isActive, isLinearprogress } = useSelector((state) => state.fileUpload);
  const reduxDispatch = useDispatch();
  const projectId = useSelector((state) => state.projectIdList);
  const dataSourceIndex = useSelector((state) => state.socket.processingDataSources);
  const indexStats = useSelector((state) => state.socket.indexStatus);

  const handleClearNotification = async () => {
    reduxDispatch(clearExtractReduxData());
    try {
      const response = await fetchData(
        `/notification/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/user/${projectId?.userId}/notification
      `,
        "DELETE"
      );
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };
  const POLLING_INTERVAL = 10000;

  useEffect(() => {
    if (!dataSourceIndex.length) return;

    const pollDataSource = (item) => {
      const intervalId = setInterval(async () => {
        try {
          reduxDispatch(updateDataSource({ ...item, status: "inProgress" }));
          reduxDispatch(setNotificationStatus(true))
          // const payload={indexers:indexdataSource}
          dataSourceIndex.filter((value) =>
            ["Start Indexing", "inProgress"].includes(value.status)
          );

          const payload = { indexers: dataSourceIndex.map((value) => value.id) };
          const response = await fetchData(`/search/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/users/${projectId?.userId}/indexes?indexId=${projectId?.indexId}`, "POST", payload, null);

          response?.results.map((_item) => {
            reduxDispatch(
              updateDataSource({ id: _item?.indexer, status: _item?.lastResult?.status || "inProgress" })
            );
          });

          if(response.results){
            const currentDataSource = response?.results.find(({indexer})=> indexer === item.id)
            console.log(currentDataSource,"data...")
            if(currentDataSource && currentDataSource?.lastResult?.status === "success"){
              clearInterval(intervalId); // Stop polling
            }
          }
        } catch (error) {
          console.error(`Polling error for item ${item.id}:`, error);
          clearInterval(intervalId); // Stop polling on error
          reduxDispatch(updateDataSource({ ...item, status: "failed" }));
        }
      }, POLLING_INTERVAL);
    };

    dataSourceIndex.forEach((item) => {
      if (item?.status === "Start Indexing") {
        pollDataSource(item);
      }
      
    });
  }, [dataSourceIndex.length]);

  return (
    <NotificationConfigRoot variant="permanent" ownerState={{ OpenConfiguratorNotification }}>
      <SoftBox display="flex" alignItems="baseline" textAlign="end" justifyContent="end !important">
        <Icon
          sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({
            fontSize: `${size.md} !important`,
            fontWeight: `${fontWeightBold} !important`,
            stroke: dark.main,
            strokeWidth: "2px",
            cursor: "pointer",
            mt: 2,
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </SoftBox>
      <SoftBox pt={1.25} pb={3}>
        <SoftBox sx={{ border: "border 2px solid " }}>
          <Typography
            sx={{
              borderBottom: "1px solid #dee0e1",
              padding: "15px",
              fontWeight: "600",
              fontSize: "16px",
              width: "auto",
            }}
          >
            Notifications
          </Typography>
          {promptProcess?.length > 0 && (
            <Typography
              sx={{
                display: "flex",
                textAlign: "end",
                alignItems: "center",
                fontSize: 14,
                paddingX: 2,
                justifyContent: "end",
                marginY: 1,
                "&:hover": {
                  color: "lightCoral",
                  cursor: "pointer",
                },
              }}
              onClick={handleClearNotification}
            >
              Clear All
            </Typography>
          )}

          <>
            {/* {isLinearprogress && <LinearProgress color="success"/>} */}
            {/* {isLinearprogress && } */}
            {!!dataSourceIndex.length && indexStats === 'notStarted' &&
              dataSourceIndex.map((value) => (
                <div key={value.id}>
                  <NotificationProgressItem
                    color="secondary"
                    image={
                      <Icon
                        fontSize="small"
                        sx={{ color: ({ palette: { white } }) => white?.main }}
                      >
                        upload
                      </Icon>
                    }
                    title="Indexing"
                    onClick={handleCloseMenu}
                    isLinearProgress={["Start Indexing", "inProgress"].includes(value.status)}
                    time={Date.now()}
                    subTitle={{
                      status: value.status,
                    }}
                  />
                </div>
              ))}
            {isActive ? (
              <NotificationProgressItem
                color="secondary"
                image={
                  <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white?.main }}>
                    upload
                  </Icon>
                }
                title="Uploading URL List"
                onClick={handleCloseMenu}
                isProgress
              />
            ) : null}

            {promptProcess && promptProcess?.length != 0 ? (
              <>
                {[...promptProcess]?.map((data, index) => {
                  return (
                    <NotificationProgressItem
                      color="secondary"
                      image={
                        <Icon
                          fontSize="small"
                          sx={{ color: ({ palette: { white } }) => white?.main }}
                        >
                          upload
                        </Icon>
                      }
                      key={index}
                      onClick={handleCloseMenu}
                      title={data.service}
                      time={data.createdAt}
                      subTitle={{ status: data.status, title: data?.title }}
                    />
                  );
                })}
              </>
            ) : (
              <Typography
                sx={{
                  width: "240px",
                  padding: 1,
                  textAlign: "center",
                  fontSize: 14,
                  height: "200px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                No Notification
              </Typography>
            )}
          </>
        </SoftBox>
      </SoftBox>
    </NotificationConfigRoot>
  );
}

export default NotificationSidebar;
