import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import SoftBox from "components/soft-box";
import SoftInput from "components/soft-input";
import SoftSelect from "components/soft-select";
import SoftCheckBox from "components/soft-checkbox";
import fetchData from "services/api";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import PageLoader from "components/page-loader";

const PromptTemplateListing = ({ handleViewTemplate, handleSelectData }) => {
  const { orgId } = useAuth();
  const [cardData, setCardData] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const projectId = useSelector((state) => state.projectIdList.projectId);

  const categoryOptions = [
    {
      // id:0,
      value: "option 1",
      label: "option 1",
    },
    {
      // id:1,
      value: "option 2",
      label: "option 2",
    },
    {
      // id:2,
      value: "option 3",
      label: "option 3",
    },
  ];

  const taskOptions = [
    {
      // id:0,
      value: "option 1",
      label: "option 1",
    },
    {
      // id:1,
      value: "option 2",
      label: "option 2",
    },
    {
      // id:2,
      value: "option 3",
      label: "option 3",
    },
  ];

  const checkBoxOptions = [
    {
      // id:0,
      value: "Audio",
      label: "Audio",
    },
    {
      // id:1,
      value: "Text",
      label: "Text",
    },
    {
      // id:2,
      value: "Video",
      label: "Video",
    },
    {
      // id:2,
      value: "Image",
      label: "Image",
    },
    {
      // id:2,
      value: "Document",
      label: "Document",
    },
  ];

  const fetchTempalteData = async () => {
    const response = await fetchData(
      `/prompt_template/organizations/${orgId}/projects/${projectId}/template`,
      "GET"
    );
    if (response) {
      setIsApiLoading(false);
    }
    setCardData(response?.data);
  };

  useEffect(() => {
    setIsApiLoading(true);
    if (projectId != null) {
      fetchTempalteData();
    }
  }, [projectId]);

  const handleCategory = (value) => {
    console.log(value, "on click");
  };

  const handleCheckBox = (value) => {
    console.log(value,"HandleCheckBox");
  };
  return (
    <Box>
      {isApiLoading ? (
        <PageLoader />
      ) : (
        <Box
          sx={{
            gap: 10,
            padding: 5,
            width: "100%",
            display: "flex",
            background: "white",
            borderRadius: "10px",
            alignItems: "centre",
            flexDirection: "column",
          }}
        >
          <SoftBox>
            <Typography sx={{ fontSize: 30, fontWeight: 700, color: "black" }}>
              Prompt Templates
            </Typography>
            <Typography sx={{ color: "slateGrey", fontSize: 20 }}>
              Browse prompt templates classified by category and task.
            </Typography>
          </SoftBox>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Box sx={{ gap: 4, width: "100%", display: "flex", flexDirection: "column" }}>
              <SoftBox sx={{ gap: 3, width: "100%", display: "flex" }}>
                <SoftBox sx={{ width: "60%" }}>
                  <SoftInput placeholder="Search Template Prompts" />
                </SoftBox>

                <SoftBox sx={{ width: "20%" }}>
                  <SoftSelect
                    defaultValue={{ value: "Select Category", label: "Select Category" }}
                    options={categoryOptions}
                    onChange={handleCategory}
                  />
                </SoftBox>

                <SoftBox sx={{ width: "20%" }}>
                  <SoftSelect
                    defaultValue={{ value: "Select Task", label: "Select Task" }}
                    options={taskOptions}
                    onChange={handleCategory}
                  />
                </SoftBox>
              </SoftBox>
              <SoftBox>
                <SoftCheckBox
                  style={{ display: "flex", gap: 20 }}
                  options={checkBoxOptions}
                  onChange={handleCheckBox}
                />
              </SoftBox>
            </Box>

            <SoftBox sx={{ gap: 2, width: "100%", display: "flex", flexWrap: "wrap" }}>
              {cardData.length > 0 ? (
                cardData.map((data) => {
                  return (
                    <Card
                      key={data.id}
                      sx={{
                        paddingX: 5,
                        width: "24%",
                        height: "150px",
                        color: "slateGrey",
                        display: "flex",
                        textAlign: "center",
                        justifyContent: "center",
                        border: "2px solid #edf2f6",
                        "&:hover": {
                          cursor: "pointer",
                          border: "2px dashed slateGray",
                        },
                      }}
                      onClick={() => handleViewTemplate(data)}
                    >
                      {data.title}
                    </Card>
                  );
                })
              ) : (
                <Box
                  sx={{
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #edf2f6",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "30px" }}>No Records</Typography>
                </Box>
              )}
            </SoftBox>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PromptTemplateListing;
