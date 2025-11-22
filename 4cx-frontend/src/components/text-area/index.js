import * as React from "react";
import { styled } from "@mui/system";
import { TextareaAutosize } from "@mui/material";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";

const Container = styled("div")({
  position: "relative",
  width: "100%",
});

const TitleWrapper = styled("div")({
  position: "absolute",
  top: "8px",
  left: "12px",
  display: "flex",
  alignItems: "center",
  zIndex: 1,
  justifyContent: "space-between",
  width: "45%",
});

const Title = styled(Typography)({
  backgroundColor: "#fff",
  padding: "0 4px",
  fontSize: "12px",
  fontWeight: "bold",
  lineHeight: "1",
});

const EditButton = styled(EditIcon)({
  marginLeft: "8px",
  cursor: "pointer",
});

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  max-width: 50%; 
  min-width: 200px;
  min-height: 100px; 
  max-height: 350px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  padding-top: 50px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[900]};
  background: ${theme.palette.mode === "dark" ? theme.palette.grey[900] : "#F6F6F6"};
  border: 1px solid ${
    theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]
  };
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50]
  };
`
);

export default function MaxHeightTextarea({ editTitle, title, onEditClick, ...props }) {
  return (
    <Container>
      <TitleWrapper>
        <Title sx={{ backgroundColor: "transparent !important" }} variant="body2">
          {title}
        </Title>
        {onEditClick && <EditButton editTitle onClick={onEditClick} />}
      </TitleWrapper>
      <Textarea sx={{ color: "grey.700" }} {...props} />
    </Container>
  );
}
