import React from "react";
import { Box } from "@mui/material";
import SoftButton from "components/soft-button";
import SoftSelect from "components/soft-select";
import SoftTypography from "components/soft-typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SoftBox from "components/soft-box";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { countryCodeData } from "../constants";

export default function PhoneNumberDetails({
  routeState,
  phoneNumberData,
  purchaseStatus,
  handleSlectCountryCode,
  handlePurchasePhoneNumber,
  handleReleaseNumberRequest,
  isLoading,
  savedStatus
}) {
  const getSelectComponentValue = (region) => {
    if (!region) return null;

    const country = countryCodeData.find((item) => item.value === region);
    return country ? { label: country.label, value: country.value } : null;
  };

  const renderPhoneNumberDetailsUI = () => {
    return routeState?.action === "view" ? (
      <>
        <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle">
          Active Phone Number
        </SoftTypography>
        <SoftTypography
          sx={{ marginY: 2, marginBottom: 2, fontWeight: "light" }}
          variant="subtitle2"
        >
          The phone number below is currently active and able to receive phone calls. To release
          this phone number you can click the below button.
        </SoftTypography>
        <SoftTypography
          sx={{ marginTop: 1, marginBottom: 2, fontWeight: "light" }}
          variant="subtitle2"
        >
          <span style={{ fontWeight: "bold" }}>Note:</span>If you release a phone number you may not
          be able to get the same number back again. In the event of purchasing a new phone number
          in the same region, it will be a different phone number.
        </SoftTypography>

        <Box sx={{ marginBottom: 10 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 2,
            width: "40%",
            marginY: 6,
          }}
        >
          <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
            Region
          </SoftTypography>
          <Box
            sx={{ bgcolor: "#d8e0ed", paddingX: 2, paddingY: 0.5, borderRadius: 1, width: "60%" }}
          >
            <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
              {phoneNumberData.region}
            </SoftTypography>
          </Box>

          <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
            Phone Number
          </SoftTypography>
          <Box
            sx={{ bgcolor: "#d8e0ed", paddingX: 2, paddingY: 0.5, borderRadius: 1, width: "60%" }}
          >
            <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
              {phoneNumberData.phoneNumber}
            </SoftTypography>
          </Box>

          <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
            Status
          </SoftTypography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor:
                phoneNumberData.status === "Active"
                  ? "#a0deb0"
                  : phoneNumberData.status === "Released"
                    ? "#edc6c5"
                    : "#d8e0ed",
              paddingX: 2,
              paddingY: 0.5,
              borderRadius: 1,
              width: "60%",
            }}
          >
            {phoneNumberData.status === "Active" ? (
              <CheckCircleIcon sx={{ color: "green" }} />
            ) : phoneNumberData.status === "Released" ? (
              <WarningIcon sx={{ color: "red" }} />
            ) : (
              ""
            )}
            <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle2">
              {phoneNumberData.status}
            </SoftTypography>
          </Box>
        </Box>
        {phoneNumberData.status === "Active" && (
          <SoftButton
            loading={isLoading}
            variant="gradient"
            color="dark"
            onClick={() => handleReleaseNumberRequest()}
          >
            Release Phone Number
          </SoftButton>
        )}
      </>
    ) : (
      <>
        {/* // ! ===================== 1. Install 4CX in your Code Snippet application =======================*/}
        <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle">
          01. Choose Region
        </SoftTypography>
        <SoftTypography
          sx={{ marginTop: 1, marginBottom: 2, fontWeight: "light" }}
          variant="subtitle2"
        >
          Add fourcx widget to your project using the following snippet
        </SoftTypography>
        <Box sx={{ width: "30%" }}>
          <SoftSelect
            name="country"
            defaultValue={{
              value: "Select Country",
              label: "Select Country",
            }}
            value={phoneNumberData.region ? getSelectComponentValue(phoneNumberData.region) : null}
            options={countryCodeData}
            onChange={handleSlectCountryCode}
            fullWidth
            InputLabelProps={{
              style: { fontSize: "14px" },
            }}
            InputProps={{
              style: { fontSize: "16px", padding: "12px" },
            }}
          />
        </Box>

        <Box sx={{ marginBottom: 10 }} />

        {/* // ! ===================== 2. Install 4CX in your Code Snippet application =======================*/}

        <SoftTypography sx={{ fontWeight: "bold" }} variant="subtitle">
          02. Purchase Phone Number
        </SoftTypography>
        <SoftTypography
          sx={{ marginTop: 1, marginBottom: 2, fontWeight: "light" }}
          variant="subtitle2"
        >
          Purchase phone number for the selected country above
        </SoftTypography>
        <SoftTypography
          sx={{ marginTop: 1, marginBottom: 2, fontWeight: "bold" }}
          variant="subtitle2"
        >
          Note: Each Number costs $2.00
        </SoftTypography>

        <SoftButton
          variant="gradient"
          color="dark"
          onClick={handlePurchasePhoneNumber}
          loading={isLoading}
          disabled = {!savedStatus}
        >
          Purchase Phone Number
        </SoftButton>

        {purchaseStatus && (
          <SoftBox
            sx={{
              backgroundColor: "#b0ffdd",
              padding: 2,
              marginY: 4,
            }}
            borderRadius={"lg"}
            shadow={"sm"}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <CheckCircleOutlineIcon fontSize={"medium"} />

              <SoftTypography variant="subtitle" sx={{ fontWeight: "bold" }}>
                Successfully{" "}
                <span style={{ fontWeight: "bold", color: "black" }}>+1 873452348234</span> has been
                purchased
              </SoftTypography>
            </Box>
            <SoftTypography variant="subtitle2">
              Now you can utilise your new phone number for your use
            </SoftTypography>
          </SoftBox>
        )}
      </>
    );
  };

  return (
    <Box
      padding={3}
      sx={{
        height: "90%",
        width: "100%",
        backgroundColor: "white",
        overflowY: "scroll",
      }}
      shadow={"sm"}
      borderRadius={"lg"}
    >
      {renderPhoneNumberDetailsUI()}
    </Box>
  );
}
