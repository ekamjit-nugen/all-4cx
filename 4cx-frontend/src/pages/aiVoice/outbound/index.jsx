import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import SoftBox from "components/soft-box";
import SoftInput from "components/soft-input";
import SoftButton from "components/soft-button";
import SoftSnackbar from "components/soft-snackbar";
import SoftSelect from "components/soft-select";
import { IconPlus } from "@tabler/icons-react";
import OutboundDataTable from "./OutboundDataTable";
import DatePicker from "react-datepicker";
import SoftTypography from "components/soft-typography";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import fetchData from "services/api";
import { useLocation, useNavigate } from "react-router-dom";
import SoftTextArea from "components/soft-textarea";
import moment from "moment";

export default function Outbound() {
  // ! ======================= (STATE) =============================
  const [snakbarState, setSnakbarState] = useState({
    title: "",
    type: "",
    status: false,
    message: "",
  });
  const [outboundData, setOutboundData] = useState({
    outboundJobName: "",
    categoryTag: "",
    description: "",
    phoneNumber: {
      value: "",
      label: "",
    },
  });
  // ! ============= (OTHER CONTEXT AND REFS) ========================
  const initialOutbound = {
    contactName: "",
    phoneNumber: "",
    category: "",
    description: "",
    scheduled: "",
  };
  const [phoneNumberOptions, setPhoneNumberOptions] = useState([]);
  const { orgId, userId } = useAuth();
  const projectId = useSelector((state) => state.projectIdList);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setCreateOutbound(initialOutbound);
    setSelectedDate("");
    setOpen(false)
  };
  const [selecteDate, setSelectedDate] = useState("");
  const [createOutbound, setCreateOutbound] = useState(initialOutbound);
  const [selectedArray, setSelectedArray] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [editOption,setEditOption] = useState(false)

  const navigate = useNavigate()

  const handleInputChange = (name, value) => {
    setCreateOutbound((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleOpen = () => {
    if (location?.state === null) {
      setSnakbarState({
        type: "error",
        status: true,
        message: "Select Outbound Job Or Create New One",
      });
    } else {
      setOpen(true);
    }
  };

  const handleSelectedRow = (index) => {
    const row = tableData[index];
    // Check if the row is already selected
    const isSelected = selectedArray.some((item) => item.phoneNumber === row.phoneNumber);

    if (isSelected) {
      // Remove the row if it's already selected
      setSelectedArray(selectedArray.filter((item) => item.phoneNumber !== row.phoneNumber));
    } else {
      // Add the row if it's not selected
      setSelectedArray([...selectedArray, row]);
    }
  };

  const handleSnackBarClose = () => {
    setSnakbarState({
      status: false,
      message: "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOutboundData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFetchInitialPhoneNumber = async () => {
    try {
      const API_URI = `/phone-number/organizations/${orgId}/projects/${projectId?.projectId}/users/${userId}/numbers`;
      const request = await fetchData(API_URI, "GET", {});
      const { data } = request;
      const phoneNumberoption = data?.map((values) => {
        return { label: values?.phoneNumber, value: values?.phoneNumber };
      });
      setPhoneNumberOptions(phoneNumberoption);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
    }
  };

  const fetchTableData = async () => {
    try {
      const fetchListData = await fetch(
        `${process.env.REACT_APP_BASE_URL}outbound/organizations/${orgId}/projects/${projectId?.projectId}/users/${userId}/outboundCall/${location?.state?.outboundJobData?._id}/call`
      );
      const data = await fetchListData.json();
      setTableData(data?.data);
    } catch (error) {
      console.error(error, "Error");
    }
  };
  useEffect(() => {
    if (location?.state && location?.state?.outboundJobData && location?.state?.action === "view") {
      setOutboundData({
        ...location?.state?.outboundJobData,
        phoneNumber: {
          label: location?.state?.outboundJobData?.phoneNumber,
          value: location?.state?.outboundJobData?.phoneNumber,
        },
      });
    }
  }, [location?.state]);

  useEffect(() => {
    handleFetchInitialPhoneNumber();
    if (orgId && userId && projectId?.projectId && location?.state?.outboundJobData) {
      fetchTableData();
    }
  }, [orgId, projectId?.projectId, userId, location?.state]);

  const createOutboundDataApi = async () => {
      try {
        const response = await fetchData(
          `${process.env.REACT_APP_BASE_URL}outbound/organizations/${orgId}/projects/${projectId?.projectId}/users/${userId}/outboundCall/${location?.state?.outboundJobData?._id}/call`,
          "POST",
          createOutbound
        );
        setSnakbarState({
          type: "success",
          status: true,
          message: response?.message,
        });
        
        setOpen(false);
        setCreateOutbound(initialOutbound);
        setSelectedDate("");
        fetchTableData();
      } catch (error) {
        console.error(error, "error");
        setSnakbarState({
          type: "error",
          status: true,
          message: response?.message,
        });
        setOpen(false);
      }
  };

  const handleEditApi=async()=>{
    try {
      const response = await fetchData(
        `${process.env.REACT_APP_BASE_URL}outbound/${createOutbound?._id}/call`,
        "PUT",
        createOutbound
      );
      setSnakbarState({
        type: "success",
        status: true,
        message: response?.message,
      });
      setOpen(false);
      setEditOption(false)
      setSnakbarState({
        type: "success",
        status: true,
        message: response?.message,
      });
      setCreateOutbound(initialOutbound)
      setSelectedDate("");
      fetchTableData();
    } catch (error) {
      console.error(error, "error");
      setSnakbarState({
        type: "error",
        status: true,
        message: response?.message,
      });
      setOpen(false);
    }
  }

  const handleEdit = (row)=>{
    setEditOption(true)
    handleOpen(true)
    setCreateOutbound(row)
    setSelectedDate(new Date(row?.scheduled.toLocaleString("en-US")))
  }

  const handleDelete=async(row)=>{
    try {
      const response = await fetchData(
        `${process.env.REACT_APP_BASE_URL}outbound/${row?._id}/call`,
        "DELETE",
        {}
      );
      setSnakbarState({
        type: "success",
        status: true,
        message: response?.message,
      });
      setOpen(false);
      setEditOption(false)
      setSnakbarState({
        type: "success",
        status: true,
        message: response?.message,
      });
      fetchTableData();
    } catch (error) {
      console.error(error, "error");
      setSnakbarState({
        type: "error",
        status: true,
        message: response?.message,
      });
      setOpen(false);
    }
  }

  const saveOutboundData = async () => {
    try {
      const response = await fetchData(
        `${process.env.REACT_APP_BASE_URL}/outbound/organizations/${orgId}/projects/${projectId?.projectId}/users/${userId}/outboundJob`,
        "POST",
        { ...outboundData, phoneNumber: outboundData?.phoneNumber?.label }
      );
      setSnakbarState({
        type: "success",
        status: true,
        message: response?.message,
      });
      navigate('/ai-voice/outbound-list')
    } catch (error) {
      console.error(error, "error");
      setSnakbarState({
        type: "error",
        status: true,
        message: response?.message,
      });
    }
  };

  const handleSelectedPhoneNumber = (phoneValue) => {
    const { value, label } = phoneValue;
    setOutboundData({ ...outboundData, phoneNumber: { value, label } });
  };
  const handleDatePicker = (date) => {
    setSelectedDate(date);
  };
  const createOutboundData = [
    {
      title: "Contact Name",
      name: "contactName",
      value: "",
    },
    {
      title: "Phone Number",
      name: "phoneNumber",
      value: "",
    },
    {
      title: "Category",
      name: "category",
      value: "",
    },
    {
      title: "Description",
      name: "description",
      value: "",
    },
    {
      title: "Scheduled",
      name: "scheduled",
      value: "",
    },
    // {
    //   title: "Call Length",
    //   name: "callLength",
    //   value: "",
    // },
    // {
    //   title: "Status",
    //   name: "status",
    //   value: "",
    // },
  ];

  // ! ======================= ( UI RENDER ) ========================

  return (
    <Card
      sx={{
        gap: 8,
        paddingX: 4,
        paddingTop: 5,
        paddingBottom: 4,
        display: "flex",
        overflowX: "auto",
        flexDirection: "column",
        height: "calc(100vh - 150px)",
      }}
    >
      <Box display={"flex"} justifyContent={"space-between"} height={"85%"}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            // alignItems: "flex-start",
            flex: 1.3,
            borderRightWidth: 1,
            gap: 4,
            // justifyContent: "space-between",
            paddingRight: 4,
            minWidth:'400px !important'
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
              Outbound Job Name
            </Typography>
            <SoftInput
              placeholder="Eg: Fintech PVT LTD"
              name="outboundJobName" // Add name attribute
              value={outboundData.outboundJobName}
              onChange={handleChange}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 4,
              borderWidth: 1,
              borderRadius: 2,
              padding: 4,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                Category Tag
              </Typography>
              <SoftInput
                placeholder="Eg: Finance"
                name="categoryTag" // Add name attribute
                value={outboundData.categoryTag}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                Description
              </Typography>
              <SoftTextArea
                placeholder="Eg: Helpline for Financial Service"
                name="description" // Add name attribute
                value={outboundData.description}
                onChange={handleChange}
              />
            </Box>
          </Box>

          <Box style={{ width: "100%" }}>
            <SoftSelect
              name="phone number"
              defaultValue={{
                value: "Select Phone Number",
                label: "Select Phone Number",
              }}
              value={outboundData?.phoneNumber}
              options={phoneNumberOptions}
              onChange={handleSelectedPhoneNumber}
              fullWidth
              InputLabelProps={{
                style: { fontSize: "14px" },
              }}
              InputProps={{
                style: { fontSize: "16px", padding: "12px" },
              }}
            />
          </Box>
          {location?.state?.action !== "view" && (
            <SoftButton
              variant="gradient"
              color="dark"
              onClick={() => {
                saveOutboundData();
              }}
              className="w-fit"
            >
              Save
            </SoftButton>
          )}
          {location?.state?.action === "view" && (
            <SoftButton variant="gradient" color="dark" onClick={() => {}} className="w-fit">
              View Details
            </SoftButton>
          )}
        </Box>
        <Box paddingLeft={4} flex={5}>
          <div className="flex justify-end">
            <div className="flex gap-2">
              <SoftButton
                variant="gradient"
                color="dark"
                onClick={() => {}}
                disabled={!selectedArray.length}
              >
                check status
              </SoftButton>
              <SoftButton
                variant="gradient"
                color="dark"
                onClick={() => {}}
                disabled={!selectedArray.length}
              >
                Call Now
              </SoftButton>
            </div>
          </div>
          <OutboundDataTable
            handleOpen={handleOpen}
            tableData={tableData}
            handleSelectedRow={handleSelectedRow}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
          {/* <div className="w-full flex justify-center pt-6" onClick={handleOpen}>
            <IconPlus className="w-8 h-8 border-2 border-black rounded-full" />
          </div> */}
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h4" fontWeight="bold">
              { editOption ? "Edit Outbound" : "Create New Outbound"}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <SoftBox display="flex" flexDirection="column" gap={2}>
              {createOutboundData.map((values) => {
                return (
                  <>
                    <SoftTypography variant="subtitle2">{values.title}</SoftTypography>
                    {(values.title != "Scheduled" && values.title != "Description") && (
                      <SoftInput
                        variant="outlined"
                        value={createOutbound[values?.name]}
                        onChange={(e) => {
                          handleInputChange(values?.name, e.target.value);
                        }}
                        fullWidth
                        InputLabelProps={{
                          style: { fontSize: "14px" },
                        }}
                        InputProps={{
                          style: { fontSize: "16px", padding: "12px" },
                        }}
                      />
                    )}
                    {values.title == "Description" &&<SoftTextArea
                      variant="outlined"
                      name="description"
                      value={createOutbound[values?.name]}
                      onChange={(e) => {
                        handleInputChange(values?.name, e.target.value);
                      }}
                      multiline
                      rows={3}
                      fullWidth
                      InputLabelProps={{
                        style: { fontSize: "14px" }, // modern input style
                      }}
                      InputProps={{
                        style: { fontSize: "16px", padding: "12px" }, // modern input style
                      }}
                    />}
                    {values.title == "Scheduled" && (
                      <div
                        className="p-1"
                        style={{
                          border: "1px solid #abb1bf",
                          borderRadius: "6px",
                        }}
                      >
                        <DatePicker
                          label="Schedule Date"
                          selected={selecteDate}
                          onChange={(date) => {
                            handleDatePicker(date), handleInputChange(values?.name, date);
                          }}
                          minDate={moment().toDate()}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy , h:mm aa"
                          className="w-full border-none outline-none "
                        />
                      </div>
                    )}
                  </>
                );
              })}
            </SoftBox>
          </DialogContent>

          <DialogActions>
            <SoftButton
              style={{ width: 100 }}
              variant="gradient"
              color="light"
              onClick={handleClose}
            >
              Cancel
            </SoftButton>
            {!editOption && <SoftButton
              style={{ width: 100 }}
              variant="gradient"
              color="dark"
              onClick={createOutboundDataApi}
              disabled={
                !createOutbound.category.length ||
                !createOutbound.contactName.length ||
                !createOutbound.description.length ||
                !createOutbound.phoneNumber.length ||
                !createOutbound.scheduled
              }
            >
              Save
            </SoftButton>}
            {editOption && <SoftButton
              style={{ width: 100 }}
              variant="gradient"
              color="dark"
              onClick={handleEditApi}
              disabled={
                !createOutbound.category.length ||
                !createOutbound.contactName.length ||
                !createOutbound.description.length ||
                !createOutbound.phoneNumber.length ||
                !createOutbound.scheduled
              }
            >
              update
            </SoftButton>}
          </DialogActions>
        </Dialog>
        <SoftSnackbar
          color={snakbarState.type}
          icon="check_circle"
          title={snakbarState.type === "success" ? "Success!" : "Something went wrong!"}
          content={snakbarState.message}
          close={handleSnackBarClose}
          open={snakbarState.status}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={1000}
          onClose={handleSnackBarClose}
        />
      </Box>
    </Card>
  );
}
