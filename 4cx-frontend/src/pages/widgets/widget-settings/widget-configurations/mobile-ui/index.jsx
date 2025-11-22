import React from "react";
import SoftBox from "components/soft-box";
import SoftTypography from "components/soft-typography";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import WorkInProgressImage from "./work-in-progress.png";
import { Box } from "@mui/material";

export default function MobileUISection() {
  return (
    <Box
      padding={3}
      sx={{
        height: "calc(100% - 230px)",
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SoftBox
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          backgroundColor: "#ebebeb",
          padding: 4,
          marginBottom: 2,
        }}
        borderRadius={"lg"}
        shadow={"lg"}
      >
        <img
          style={{
            height: 100,
            marginBottom: 10,
          }}
          src={WorkInProgressImage}
          alt="work-progress-image"
        />

        <SoftBox sx={{ display: "flex", alignItems: "center", gap: 1.2, marginBottom: 1.5 }}>
          <ConstructionOutlinedIcon fontSize={"medium"} />
          <SoftTypography variant="subtitle" sx={{ fontWeight: "bold" }}>
            Currently functionality is under progress!
          </SoftTypography>
        </SoftBox>
        <SoftTypography variant="subtitle2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe hic omnis rerum corporis
          laudantium tenetur ut accusantium velit nobis sapiente, quam voluptatum nostrum vitae
          voluptatem earum sunt odio laboriosam. Veritatis?
        </SoftTypography>
      </SoftBox>
    </Box>
  );
}
