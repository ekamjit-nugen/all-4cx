import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@mui/material";
import Card from "@mui/material/Card";
import { toast } from "react-toastify";
import fetchData from "../../services/api";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import SoftButton from "components/soft-button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

export default function CreateProjectPage() {
  const { userId, orgId } = useAuth();
  const [inputValue, setInputValue] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    handleTenantData()
  }, [orgId])

  const handleTenantData = async () => {
    try {
      const response = await fetchData("tenant/organization", "POST", {
        userId: userId,
        orgId: orgId,
      });
    } catch (error) {
      console.error("Error extracting data:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetchData("project/", "POST", {
        title: inputValue,
        userId: userId,
        collaborators: "",
        orgId: orgId,
      });

      navigate("/")
    } catch (error) {
      console.error("Error during project creation:", error);
      toast.error("An error occurred while creating the project.");
    }
  };

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
          height: "30%",
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
          }}
        >
          Projects
        </Typography>

        <CardContent
          style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "3rem 2rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Typography style={{ fontSize: "14px", fontWeight: "500" }}>
              Create New Projects
            </Typography>
            <Input
              sx={{
                "& .MuiInputBase-input": {
                  width: "100% !important",
                },
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <SoftButton
            variant="gradient"
            color="dark"
            style={{ width: "40%" }}
            onClick={handleCreate}
          >
            Create
          </SoftButton>
        </CardContent>
      </div>
    </Card>
  );
}
