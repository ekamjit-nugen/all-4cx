import { Card, CardContent, Typography } from "@mui/material";
import SoftButton from "components/soft-button";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function RequestAccessPage() {
    const navigate = useNavigate()
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f8f9fa",
      }}
    >
      <div
        style={{
          width: "400px",
          height: "20%",
          border: "2px solid #dee0e1",
          borderRadius: "10px",
          background: "white",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        }}
      >
        <Typography
          sx={{
            borderBottom: "2px solid #dee0e1",
            padding: "20px",
            fontWeight: "600",
            fontSize: "16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Request for Project
        </Typography>

        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "3rem 2rem",
            justifyContent: "center",
            alignItems:"center"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "5px"}}>
            <Typography style={{ fontSize: "14px", fontWeight: "500" }}>
              Get Access from Admin
            </Typography>
          </div>

          <SoftButton
            variant="gradient"
            color="dark"
            style={{ width: "40%" }}
            onClick={()=>{navigate(-1)}}
          >
            Request
          </SoftButton>
        </CardContent>
      </div>
    </Card>
  );
}
