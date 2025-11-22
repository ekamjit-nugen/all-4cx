import { ArrowBackIos, ArrowForwardIos, FastForward, FastRewind } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import fetchData from "../../../services/api";
import { useSelector } from "react-redux";
import SoftTypography from "components/soft-typography";

function ChooseDataSource() {
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { userId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList.projectId);

  const [selectedIds, setSelectedIds] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await fetchData("search/sourceData", "POST", {
          userId: userId,
          projectId: projectId,
          document: "",
          strictness: "",
          References: "",
        });
        setInitialData(data.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    if (projectId) {
      fetchInitialData();
    }
  }, [userId, projectId]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleMoveForward = () => {
    const selectedItems = initialData.filter((item) => selectedIds.includes(item._id));
    setSalesData([...salesData, ...selectedItems]);
    setInitialData((prevData) => prevData.filter((item) => !selectedIds.includes(item._id)));
    setSelectedIds([]);
  };

  const handleMoveBackward = () => {
    const selectedItems = salesData.filter((item) => selectedIds.includes(item._id));
    setInitialData([...initialData, ...selectedItems]);
    setSalesData((prevData) => prevData.filter((item) => !selectedIds.includes(item._id)));
    setSelectedIds([]);
  };

  const handleFastForward = () => {
    setSalesData([...salesData, ...initialData]);
    setInitialData([]);
    setSelectedIds([]);
  };

  const handleFastRewind = () => {
    setInitialData([...initialData, ...salesData]);
    setSalesData([]);
    setSelectedIds([]);
  };

  return (
    <Box>
      <Box>
        <SoftTypography sx={{ fontWeight: "bold" }}>Choose Data Source</SoftTypography>
        <SoftTypography
          sx={{
            fontWeight: "semibold",
            fontSize: "14px",
            color: "rgb(148 163 184)",
          }}
        >
          Select Data Source
        </SoftTypography>
      </Box>

      <Box
        sx={{
          display: isMediumScreen ? "grid" : "flex",
          justifyContent: "center",
          width: "100%",
          padding: "30px 0px",
        }}
      >
        <Box
          sx={{
            width: isMediumScreen ? "100%" : "30%",
            height: "250px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              border: "1px solid rgb(148 163 184)",
              padding: "5px",
              overflowY: "scroll",
              scrollbarWidth: "none", // For Firefox
              "&::-webkit-scrollbar": {
                display: "none",
              },
              width: isMediumScreen ? "40%" : "100%",
            }}
          >
            {initialData.length === 0 ? (
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "rgb(148 163 184) !important",
                }}
              >
                No data
              </Typography>
            ) : (
              initialData.map((item, index) => (
                <React.Fragment key={item._id}>
                  <Box
                    sx={{
                      padding: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Checkbox
                      checked={selectedIds.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: isMediumScreen ? "14px" : "12px",
                        color: "#252946",
                        textAlign: "start",
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.file_name}
                    </Typography>
                  </Box>
                  {index < initialData.length - 1 && (
                    <Divider sx={{ backgroundColor: "rgb(148 163 184)" }} />
                  )}
                </React.Fragment>
              ))
            )}
          </Card>
        </Box>

        <Box
          sx={{
            width: isMediumScreen ? "100%" : "10%",
            height: "250px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            sx={{ border: "1px solid #87CEEB" }}
            variant="outlined"
            startIcon={<FastForward sx={{ color: "#87CEEB" }} />}
            onClick={handleFastForward}
          />
          <Button
            sx={{ border: "1px solid grey" }}
            variant="outlined"
            startIcon={<ArrowForwardIos sx={{ color: "grey" }} />}
            onClick={handleMoveForward}
          />
          <Button
            sx={{ border: "1px solid grey" }}
            variant="outlined"
            startIcon={<ArrowBackIos sx={{ color: "grey" }} />}
            onClick={handleMoveBackward}
          />
          <Button
            sx={{ border: "1px solid #87CEEB" }}
            variant="outlined"
            startIcon={<FastRewind sx={{ color: "#87CEEB" }} />}
            onClick={handleFastRewind}
          />
        </Box>

        <Box
          sx={{
            width: isMediumScreen ? "100%" : "30%",
            height: "250px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              border: "1px solid rgb(148 163 184)",
              padding: "5px",
              overflowY: "scroll",
              scrollbarWidth: "none", // For Firefox
              "&::-webkit-scrollbar": {
                display: "none",
              },
              width: isMediumScreen ? "40%" : "100%",
            }}
          >
            {salesData.length === 0 ? (
              <SoftTypography
                sx={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "rgb(148 163 184)",
                }}
              >
                No Data
              </SoftTypography>
            ) : (
              salesData.map((item, index) => (
                <React.Fragment key={item._id}>
                  <Box
                    sx={{
                      padding: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Checkbox
                      checked={selectedIds.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: isMediumScreen ? "14px" : "12px",
                        color: "#252946",
                        textAlign: "start",
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.file_name}
                    </Typography>
                  </Box>
                  {index < salesData.length - 1 && (
                    <Divider sx={{ backgroundColor: "rgb(148 163 184)" }} />
                  )}
                </React.Fragment>
              ))
            )}
          </Card>
        </Box>

        <Box
          sx={{
            width: isMediumScreen ? "100%" : "30%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "0px 20px",
          }}
        >
          <Box sx={{ width: "100%", padding: "0px 16px" }}>
            <Typography sx={{ fontSize: "14px" }}>Number of Documents</Typography>
            <Input
              defaultValue="3"
              inputProps={{ "aria-label": "description" }}
              sx={{
                width: "100%",
                border: "none",
                borderBottom: "1px solid",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
            />
          </Box>
          <Box sx={{ width: "100%", padding: "1rem" }}>
            <Typography sx={{ fontSize: "14px" }}>Strictness</Typography>
            <Input
              defaultValue="6"
              inputProps={{ "aria-label": "description" }}
              sx={{
                width: "100%",
                borderBottom: "1px solid",
                border: "none",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
            />
          </Box>
          <Box sx={{ width: "100%", padding: "1rem" }}>
            <Typography sx={{ fontSize: "14px" }}>Number of References</Typography>
            <Input
              defaultValue="9"
              inputProps={{ "aria-label": "description" }}
              sx={{
                width: "100%",
                borderBottom: "1px solid",
                border: "none",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ChooseDataSource;
