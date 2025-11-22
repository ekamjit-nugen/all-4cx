import fetchData from "services/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SoftBox from "components/soft-box";
import { useAuth } from "@clerk/clerk-react";
import { Box, Typography } from "@mui/material";
import SoftButton from "components/soft-button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SoftDropzone from "components/soft-dropzone";

const ViewPromptTemplate = ({ handleViewTemplate, data }) => {
  const { userId, orgId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList.projectId);

  const handleClone = async () => {
    const payload = {
      promptTemplateId: data?._id,
      userId,
    };
    const response = await fetchData(
      `/prompt_template/organizations/${orgId}/projects/${projectId}/template`,
      "POST",
      payload
    );

    if (response?.message === "Prompt Template cloned successfully") {
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }
  };
  return (
    <Box
      sx={{
        gap: 5,
        padding: 5,
        width: "100%",
        display: "flex",
        background: "white",
        borderRadius: "10px",
        alignItems: "centre",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          gap: 1,
          display: "flex",
          alignItems: "center",
          "&:hover": {
            cursor: "pointer",
            color: "slateGrey",
          },
        }}
        onClick={handleViewTemplate}
      >
        <KeyboardBackspaceIcon
          sx={{
            fontSize: 50,
            color: "gray",
          }}
        />
        <Typography sx={{ fontSize: 30, fontWeight: 700 }}>{data?.title}</Typography>
      </Box>

      <Box sx={{ gap: 20, display: "flex", width: "100%" }}>
        <Box sx={{ width: "50%" }}>
          <Box sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontWeight: 500 }}>System Message</Typography>
            <SoftBox sx={{ padding: 2, background: "#edf2f6", borderRadius: 2 }}>
              {data?.system_message}
            </SoftBox>
          </Box>
        </Box>

        <Box
          sx={{ gap: 5, width: "50%", height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontWeight: 500 }}>Input Prompt</Typography>
            <SoftBox sx={{ padding: 2, background: "#edf2f6", borderRadius: 2 }}>
              {data?.input_prompt}
            </SoftBox>
          </Box>

          {data.inputMedia && (
            <Box sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontWeight: 500 }}>Input Media</Typography>
              <img
                src={data?.inputMedia}
                style={{
                  width: "50%",
                  height: "70%",
                  borderRadius: 10,
                  border: "2px solid black",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ gap: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        <Typography sx={{ fontWeight: 500 }}>Sample Response</Typography>
        <SoftBox sx={{ padding: 2, background: "#edf2f6", borderRadius: 2 }}>
          {data?.sample_response}
        </SoftBox>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          gap: 2,
          flexDirection: "row",
          paddingTop: "0px",
        }}
      >
        <SoftButton
          variant="gradient"
          color="dark"
          onClick={handleClone}
          sx={{
            width: "150px",
            "&:hover": {
              opacity: 0.5,
            },
          }}
        >
          ClONE
        </SoftButton>
      </Box>
    </Box>
  );
};

export default ViewPromptTemplate;
