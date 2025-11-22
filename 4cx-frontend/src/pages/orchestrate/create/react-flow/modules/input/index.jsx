import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import { Handle, Position } from "@xyflow/react";
import { useCallback, memo } from "react";

const Input = memo(
  ({ data, isConnectable, onUpdateData, onRemoveNode, handleTextChange, value }) => {
    const handleClose = () => {
      onRemoveNode();
    };
    const handleAddTextField = () => {
      let newFields = [{ id: "input1", value: "" }];
      onUpdateData(newFields);
    };

    const handleChange = useCallback((e, data) => {
      const textFieldCopy = data.textFields;
      textFieldCopy[0].value = e.target.value;
      onUpdateData(textFieldCopy);
    }, []);

    return (
      <Box
        sx={{
          padding: "4px 4px",
          border: "2px solid #0de3da",
          borderRadius: 2,
          width: 200,
          background: "white",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <MoreHorizIcon sx={{ height: "8px", width: "8px", color: "gray" }} />
        </Box>
        <Box sx={{ display: "grid", alignItems: "start" }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ fontSize: "10px", fontWeight: "700" }}>Input Query</Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(13, 227, 218, 0.2)",
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
                  color: "#0de3da",
                  stroke: "#0de3da",
                  strokeWidth: 1,
                  backgroundColor: "none",
                }}
              />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
            <Button
              onClick={() => handleAddTextField()}
              disabled={data.textFields && data.textFields.length > 0}
              size="small"
              sx={{
                border: "1px solid #a5e6a6",
                borderRadius: 1,
                fontSize: "8px",
                color: "#347333",
                padding: "3px 3px",
                "&:hover": {
                  backgroundColor: "#e3fbe3",
                  color: "#347333",
                },
              }}
            >
              Add Variable
            </Button>
          </Box>
          {data.textFields &&
            data.textFields?.map((field) => (
              <Box
                key={field.id}
                sx={{ display: "flex", justifyContent: "start", alignItems: "center", mb: 1 }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Enter Text"
                  value={field.value}
                  onChange={(e) => handleChange(e, data)}
                  sx={{
                    marginTop: 1,
                    width: "100% !important",
                    fontSize: "10px !important",
                    "& .MuiInputBase-input": {
                      fontSize: "10px !important",
                      width: "100% !important",
                    },
                    "& .MuiInputBase-root": {
                      padding: "5px !important",
                    },
                    "& .MuiOutlinedInput-root": {
                      padding: "5px !important",
                    },
                  }}
                />
              </Box>
            ))}
        </Box>
        <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      </Box>
    );
  }
);
export default Input;
