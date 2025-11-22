import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import SoftButton from "components/soft-button";
import { Input } from "@mui/material";
import { useState } from "react";
import { updateDataSourceName } from "store/features/searchSlice";
import { useDispatch } from "react-redux";

export default function PopupModal({ isOpen, data, type, title, isIndexFlow=false }) {
  const [input, setInput] = useState(null);
  const dispatch = useDispatch();
  const handleClose = () => {
    isOpen({
      state: false,
      data: input,
    });
  };
  const [isValidName,setIsValidName] = useState(false)
  const isValidFileName = (fileName) => {
    if(isIndexFlow){
      const pattern = /^[a-z][a-z0-9-]{0,59}$/;
      setIsValidName(pattern.test(fileName))
      return pattern.test(fileName);
    }
  };
  const style = {
    p: 4,
    top: "50%",
    left: "50%",
    width: 700,
    height: type === "input" ? 300 : "auto",
    boxShadow: 24,
    borderRadius: 10,
    position: "fixed",
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)",
    zIndex: 999,
  };
  return (
    <>
      {type === "display" && (
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Prompt Description
            </Typography>
            <Box
              sx={{ "&:hover": { color: "lightgrey", cursor: "pointer" } }}
              onClick={handleClose}
            >
              <CloseIcon />
            </Box>
          </Box>
          <Typography sx={{ mt: 2, fontSize: 16 }}>{data}</Typography>
        </Box>
      )}
      {type === "input" && (
        <Box
          sx={[
            style,
            { display: "flex", flexDirection: "column", width: 500, height: 300, gap: 4 },
          ]}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <Box
              sx={{ "&:hover": { color: "lightgrey", cursor: "pointer" } }}
              onClick={handleClose}
            >
              <CloseIcon />
            </Box>
          </Box>
          <Box
            sx={{
              gap: 5,
              display: "flex",
              flexDirection: "column",
              height: 150,
            }}
          > 
          <div className="">
            <Input
              placeholder={title}
              sx={{
                width: "100%",
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
                marginBottom:'3px'
              }}
              onChange={(e) => {
                setInput(e?.target?.value), dispatch(updateDataSourceName(e?.target?.value), isValidFileName(e?.target?.value));
              }}
            />
            {isIndexFlow && <Typography id="modal-modal-title" variant="h6" component="h2">
            Name must start with a letter, use only lowercase letters, digits, or dashes (-), and less than 60 characters.
            </Typography>}
          </div>
            <SoftButton
              variant="gradient"
              color="dark"
              onClick={() =>
                isOpen({
                  state: true,
                  data: input,
                })
              }
              disabled={isIndexFlow ? !isValidName : false}
            >
              Save
            </SoftButton>
          </Box>
        </Box>
      )}
    </>
  );
}
