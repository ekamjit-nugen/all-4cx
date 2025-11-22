import { Box, Grid } from "@mui/material";
import SoftBox from "components/soft-box";
import SoftTypography from "components/soft-typography";
import React from "react";
import { useLocation } from "react-router-dom";

export default function DataSourceCRM({
  selectedCRM,
  handleSelectDataSourceItems,
  dataSourceList,
}) {
  const location = useLocation();
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const query = useQuery();

  const service = query.get("service");

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
      <SoftBox sx={{ flex: 1 }} pt={2} px={2}>
        <SoftBox pt={4} width="80%">
          <Grid container spacing={2}>
            {dataSourceList.map((item) => (
              <Grid
                item
                xs={12}
                sm={4}
                key={item.id}
                sx={{
                  opacity: (item.type === service || !service) ? 1 : 0.5,
                }}
                onClick={!service ? () => handleSelectDataSourceItems(item) : null}
              >
                <SoftBox
                  sx={{
                    cursor: "pointer",
                    borderColor: item.id === selectedCRM && "#10004a",
                    borderWidth: item.id === selectedCRM && 2,
                  }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  p={2}
                  borderRadius="md"
                  shadow="md"
                  height={130}
                >
                  <img height={50} width={50} src={item.icon} />
                  <SoftTypography
                    width={100}
                    variant="caption"
                    sx={{ fontWeight: "bold" }}
                    mt={1}
                    textAlign="center"
                  >
                    {item.title}
                  </SoftTypography>
                </SoftBox>
              </Grid>
            ))}
          </Grid>
        </SoftBox>
      </SoftBox>
    </Box>
  );
}
