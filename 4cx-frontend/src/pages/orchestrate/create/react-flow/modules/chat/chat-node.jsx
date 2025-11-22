import {
  Box,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import fetchData from "services/api";
import { useDispatch } from "react-redux";
import { setChatModel } from "store/features/projectIdSlice";

function ChatMessageNode({
  id,
  onRemoveNode,
  isConnectable,
  selectedChatVersion,
  onChatValueChange,
}) {
  const [closeComponent, setCloseComponent] = useState(true);
  const [selectedOption, setSelectedOption] = useState(selectedChatVersion || null);
  const [chatOptions, setChatOptions] = useState([]);
  const dispatch = useDispatch();

  const handleClose = () => {
    setCloseComponent(false);
    onRemoveNode();
  };

  const handleValueChange = (event, newValue) => {
    setSelectedOption(newValue);
    if (onChatValueChange) {
      dispatch(setChatModel(newValue?.value));
      onChatValueChange(newValue);
    }
  };

  useEffect(() => {
    setSelectedOption(selectedChatVersion);
  }, [selectedChatVersion]);

  useEffect(() => {
    const fetchChatOptions = async () => {
      try {
        const response = await fetchData(
          "https://fourcx-openai.azurewebsites.net/api/ListDeployments?code=ds-r14l5CPzi0yL5bhespYmAXoA_N_o9qD50vatQ8ITIAzFu3-nd-Q%3D%3D",
          "GET"
        );
        const options = response.deployments.map((deployment) => ({
          label: deployment,
          value: deployment,
        }));
        setChatOptions(options);
      } catch (err) {
        console.log(err, "error while fetching the data");
      }
    };

    fetchChatOptions();
  }, []);

  return (
    closeComponent && (
      <Box
        sx={{
          padding: "4px 4px",
          border: "2px solid #e485f0",
          borderRadius: 2,
          width: 200,
          background: "white",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <MoreHorizIcon sx={{ height: "8px", width: "8px", color: "gray" }} />
        </Box>
        <Box sx={{ display: "grid", alignItems: "start", paddingLeft: 1 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ fontSize: "10px", fontWeight: "700" }}>Chat GPT Message</Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(228, 133, 240, 0.2)",
                  borderRadius: "50%",
                  transform: "scale(0.8)",
                },
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <CloseIcon
                sx={{
                  height: "12px",
                  width: "12px",
                  color: "#e485f0",
                  stroke: "#e485f0",
                  strokeWidth: 1,
                  backgroundColor: "none",
                }}
              />
            </IconButton>
          </Box>

          <Typography sx={{ fontSize: "9px", marginBottom: 1, fontWeight: "500" }}>
            Select Model
          </Typography>
        </Box>
        <Autocomplete
          options={chatOptions}
          getOptionLabel={(option) => option.label}
          value={selectedOption}
          onChange={handleValueChange}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder="Select Search"
              fullWidth
            />
          )}
          sx={{
            marginTop: 1,
            fontSize: "10px !important",
            "& .MuiInputBase-input": {
              fontSize: "10px !important",
            },
            "& .MuiInputBase-root": {
              padding: "5px !important",
            },
            "& .MuiOutlinedInput-root": {
              padding: "5px !important",
            },
          }}
        />

        <Handle
          type="target"
          position={Position.Left}
          id={`${id}_target_left`}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}_target_right`}
          isConnectable={isConnectable}
        />
      </Box>
    )
  );
}

export default ChatMessageNode;
