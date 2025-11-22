import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/material/styles";

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  padding: theme.spacing(0.5),
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  resize: "none",
  minHeight: "20px",
  "&:focus": {
    outline: "none",
  },
  placeholder: {
    color: theme.palette.text.secondary,
  },
}));

export const ChatTextInput = React.forwardRef(({ ...props }, ref) => (
  <StyledTextarea ref={ref} minRows={1} placeholder="Type your message here..." {...props} />
));
ChatTextInput.displayName = "ChatTextInput";
