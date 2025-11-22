import React, { useEffect } from "react";
import { CreateOrganization } from "@clerk/clerk-react";
import { Box } from "@mui/material";
import { useAuth } from "@clerk/clerk-react";
import fetchData from "../../services/api";

function CreateOrganizationPage() {
  const { userId } = useAuth();

  useEffect(() => {
    const handleUserData = async () => {
      try {
        await fetchData("tenant/", "POST", {
          userId: userId,
        });
      } catch (error) {
        console.error("Error extracting data:", error);
      }
    };
    if (userId) {
      handleUserData();
    }
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CreateOrganization
        afterCreateOrganizationUrl={"/create-project"}
        path="/create-organization"
        skipInvitationScreen={true}
      />
    </Box>
  );
}

export default CreateOrganizationPage;
