import { AppBar, Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import breakpoints from "assets/theme/base/breakpoints";
import SoftBox from "components/soft-box";
import SoftTypography from "components/soft-typography";
import React, { useEffect, useState } from "react";
import UploadComponent from "../add/upload";
import InformationBox from "../add/information-box";
import UrlUpload from "../add/url-upload";
import DataSourceGenereic from "../add/generic";
import DataSourceCRM from "../add/crm";
import DataSourceConfigurationsForm from "./data-source-configurations-form";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import fetchData from "services/api";
import {
  crmDataSourceList,
  CRMFormfieldsSchema,
  genericDataSourceList,
  genericFormfieldsSchema,
} from "./constants";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { resetDataSource } from "store/features/dataSourceSlice";
import { useDispatch } from "react-redux";
import { updateSourceType } from "store/features/dataSourceSlice";

const initialFormData = {
  name: "",
  description: "",
  baseUrl: "",
  authType: "",
  userName: "",
  password: "",
  serverCertValidation: false,
};

function DataType() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [formData, setFormData] = useState(initialFormData);
  const [formSchema, setFormSchema] = useState(null);
  const [selectedGeneric, setSelectedGeneric] = useState(null);
  const [selectedCRM, setSelectedCRM] = useState(null);
  const [selectedFormType, setSelectedFormType] = useState("");
  const [preConfiguredPlugin, setPreConfiguredPlugin] = useState({
    generic: [],
    crm: [],
  });
  const projectId = useSelector((state) => state.projectIdList.projectId);
  const { userId, orgId } = useAuth();
  const location = useLocation();
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const query = useQuery();
  const sourceData = useSelector((state) => state?.dataSource?.data);
  const sourceType = query.get("sourceType");
  const service = query.get("service");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input changes and update formData
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ! API CALLS - FETCHING AND SAVING DATA
  const saveDataConfigAPIHandler = async ({ organizationId, projectId, userId }) => {
    const url = `/data-sources/organizations/${organizationId}/projects/${projectId}/config`;
    const method = "POST";

    const data = {
      source_type: tabValue === 0 ? "generic" : tabValue === 1 ? "crm" : "",
      service: selectedFormType,
      ...formData,
    };

    try {
      const response = await fetchData(url, method, data, userId);

      if (response) {
        return response;
      }
    } catch (error) {
      console.error("Error saving data config:", error.message);
      throw error;
    }
  };
  useEffect(()=>{
    if(!location?.search){
      setSelectedCRM(null)
      setSelectedGeneric(null)
      setTabValue(0)
    }
  },[location?.search])
  const fetchDataConfigAPIHandler = async ({ organizationId, projectId, sourceType }) => {
    // const URL = `/data-sources/organizations/${organizationId}/projects/${projectId}/sourceType/${sourceType}/config`;
    // const method = "GET";

    try {
      // const response = await fetchData(URL, method, null, userId);
      // if (response) {
      //   return response;
      // }
    } catch (error) {
      console.error("Error saving data config:", error.message);
    }
  };

  // ! Fetch and Submit Handlers

  const handleFetchDataSource = async () => {
    const sourceType = tabValue === 0 ? "generic" : tabValue === 1 ? "crm" : "";

    const responseData = await fetchDataConfigAPIHandler({
      organizationId: orgId,
      projectId,
      sourceType,
    });

    if (!responseData || responseData.length === 0) {
      setFormSchema(initialFormData);
      return;
    }

    // Use Object.assign to update the specific property without mutating the original state
    const updatedPlugins = Object.assign({}, preConfiguredPlugin, {
      [sourceType]: responseData,
    });

    setPreConfiguredPlugin(updatedPlugins);
  };

  const handleUpdateConfigureData = async () => {
    const data = {
      source_type: tabValue === 0 ? "generic" : tabValue === 1 ? "crm" : "",
      service: selectedFormType,
      ...formData,
    };
    const response = await fetchData(
      `/data-sources/organizations/${orgId}/projects/${projectId}/config?sourceId=${sourceData?._id}`,
      "PUT",
      data,
      userId
    );
    toast.success(response?.message);
    dispatch(resetDataSource());
    // setFormData(initialFormData);
    if (tabValue === 0) {
      navigate(`/data/data-sources?sourceType=generic`);
    } else if (tabValue === 1) {
      navigate(`/data/data-sources?sourceType=crm`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if (!sourceData?._id) {
        const response = await saveDataConfigAPIHandler({ organizationId: orgId, projectId, userId });
        if (response) toast.success("Successfully saved configurations!");
        if (tabValue === 0) {
          dispatch(updateSourceType("generic"));
        } else if (tabValue === 1) {
          dispatch(updateSourceType("crm"));
        }
        navigate(`/data/data-sources`);
      } else{
        handleUpdateConfigureData();
      }
      // handleFetchDataSource();
    }catch(error){
      console.error(error,"error")
    }
  };

  // * GRID ITEM CLICK
  const handleSelectGenericDataSourceItems = (item) => {
    if (!selectedGeneric || selectedGeneric !== item.id) {
      // * show the selection and show the form
      setSelectedGeneric(item.id);
      setSelectedFormType(item.type);

      // * check wheather the selected item is in the state or not
      const filteredItem = preConfiguredPlugin.generic.find((data) => data.service === item.type);

      if (filteredItem) {
        const {
          data_config_name,
          description,
          url,
          authType,
          user_name,
          password,
          serverCertValidation,
        } = filteredItem;

        setFormData({
          name: data_config_name,
          description,
          baseUrl: url,
          authType,
          userName: user_name,
          password,
          serverCertValidation,
        });
      } else {
        setFormData(initialFormData);
      }
      const fields = generateGenericDataSourceFormFields(item.type);
      setFormSchema(fields);
    } else if (selectedGeneric === item.id) setSelectedGeneric(null);
  };

  const handleSelectDataSourceCRMItem = (item) => {
    if (!selectedCRM || selectedCRM !== item.id) {
      // * show the selection and show the form
      setSelectedCRM(item.id);
      setSelectedFormType(item.type);

      // * check whether the selected item is in the state or not
      const filteredItem = preConfiguredPlugin.crm.find((data) => data.service === item.type);
      if (filteredItem) {
        const {
          data_config_name,
          description,
          url,
          authType,
          user_name,
          password,
          serverCertValidation,
        } = filteredItem;

        setFormData({
          name: data_config_name,
          description,
          baseUrl: url,
          authType,
          userName: user_name,
          password,
          serverCertValidation,
        });
      } else {
        setFormData(initialFormData);
      }
      const fields = generateCRMDataSourceFormFields(item.type);
      setFormSchema(fields);
    } else if (selectedCRM === item.id) {
      setSelectedCRM(null);
    }
  };

  const generateGenericDataSourceFormFields = (dataSourceType) => {
    switch (dataSourceType) {
      case "http":
        return { fields: genericFormfieldsSchema.http };

      case "odbc":
        return { fields: genericFormfieldsSchema.odbc };

      case "odata":
        return { fields: genericFormfieldsSchema.odata };

      default:
        return {
          fields: [
            {
              name: "name",
              label: "Name",
              type: "text",
              placeholder: "Enter the name",
              required: true,
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter the description",
            },
            {
              name: "baseUrl",
              label: "Base URL",
              type: "text",
              placeholder: "Enter the base URL",
              required: true,
            },
            {
              name: "serverCertValidation",
              label: "Server Certification Validation",
              type: "switch",
            },
            {
              name: "authType",
              label: "Authentication Type",
              type: "text",
              placeholder: "Enter the authentication type",
              required: true,
            },
            {
              name: "userName",
              label: "Username",
              type: "text",
              placeholder: "Enter the username",
              required: true,
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Enter the password",
              required: true,
            },
          ],
        };
    }
  };

  const generateCRMDataSourceFormFields = (dataSourceType) => {
    switch (dataSourceType) {
      case "dynamic_365":
        return { fields: CRMFormfieldsSchema.dynamic_365 };

      case "dynamic_ax":
        return { fields: CRMFormfieldsSchema.dynamic_ax };

      case "dynamic_crm":
        return { fields: CRMFormfieldsSchema.dynamic_crm };

      default:
        return {
          fields: [
            {
              name: "name",
              label: "Name",
              type: "text",
              placeholder: "Enter the name",
              required: true,
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter the description",
            },
            {
              name: "baseUrl",
              label: "Base URL",
              type: "text",
              placeholder: "Enter the base URL",
              required: true,
            },
            {
              name: "serverCertValidation",
              label: "Server Certification Validation",
              type: "switch",
            },
            {
              name: "authType",
              label: "Authentication Type",
              type: "text",
              placeholder: "Enter the authentication type",
              required: true,
            },
            {
              name: "userName",
              label: "Username",
              type: "text",
              placeholder: "Enter the username",
              required: true,
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "Enter the password",
              required: true,
            },
          ],
        };
    }
  };

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    setSelectedGeneric(null);
    setSelectedCRM(null);
    handleFetchDataSource();
  };

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.md
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  useEffect(() => {
    if (projectId)
      if (!sourceType) {
        dispatch(resetDataSource());
      }
    handleFetchDataSource().then(() => {
      if (service) {
        if (service && sourceType === "generic") {
          const genericData = genericDataSourceList.find(({ type }) => type === service);
          if (genericData) {
            handleSelectGenericDataSourceItems(genericData);
          }
        }
        if (sourceData) {
          const data = {
            name: sourceData?.data_config_name,
            description: sourceData?.description,
            baseUrl: sourceData?.url,
            authType: sourceData?.authentication_type,
            userName: sourceData?.user_name,
            password: sourceData?.password,
            serverCertValidation: sourceData?.server_certification_validation,
          };
          setFormData(data);
        }

        if (sourceType === "generic") {
          setTabValue(0);
        }
      }
      if (service && sourceType === "crm") {
        const crmData = crmDataSourceList.find(({ type }) => type === service);
        if (crmData) {
          setTimeout(() => {
            handleSelectDataSourceCRMItem(crmData);
            if (sourceData) {
              const data = {
                name: sourceData?.data_config_name,
                description: sourceData?.description,
                baseUrl: sourceData?.url,
                authType: sourceData?.authentication_type,
                userName: sourceData?.user_name,
                password: sourceData?.password,
                serverCertValidation: sourceData?.server_certification_validation,
              };
              setFormData(data);
            }
          }, 10);
        }
        if (sourceType === "crm") {
          setTabValue(1);
        }
      }
    });
  }, [projectId, tabValue, sourceType]);

  const renderUploadComponent = () => {
    switch (tabValue) {
      case 0:
        return (
          <DataSourceGenereic
            dataSourceList={genericDataSourceList}
            selectedGeneric={selectedGeneric}
            handleSelectDataSourceItems={handleSelectGenericDataSourceItems}
          />
        );
      case 1:
        return (
          <DataSourceCRM
            dataSourceList={crmDataSourceList}
            selectedCRM={selectedCRM}
            handleSelectDataSourceItems={handleSelectDataSourceCRMItem}
          />
        );
      case 2:
        return <UploadComponent />;
      case 3:
        return <UrlUpload />;
      default:
        return null;
    }
  };

  return (
    <SoftBox pt={2} px={2}>
      <SoftTypography sx={{ fontWeight: "bold" }}>Data Source Type</SoftTypography>
      <Box
        sx={{
          display: "flex",
          justifyContent: isMediumScreen ? "center" : "space-between",
          alignItems: "center",
          width: isMediumScreen ? "100%" : "60%",
        }}
      >
        <Box
          sx={{
            pt: 10,
            width: isMediumScreen ? "80%" : "60%",
          }}
        >
          <AppBar position="static">
            <Tabs
              sx={{
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.1)",
                padding: "5px",
                display: "flex",
                justifyContent: isMediumScreen ? "center" : "flex-start",
              }}
              orientation={tabsOrientation}
              onChange={!service ? handleSetTabValue : null}
              value={tabValue}
            >
              <Tab sx={{ fontSize: "15px" }} label="Generic" />
              <Tab sx={{ fontSize: "15px" }} label="CRM" />
              <Tab sx={{ fontSize: "15px" }} label="Local" />
              <Tab sx={{ fontSize: "15px" }} label="Website" />
            </Tabs>
          </AppBar>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection={isMediumScreen ? "column" : "row"}
        justifyContent="space-around"
        alignItems="flex-start"
        gap={5}
      >
        <Box flex="1">{renderUploadComponent()}</Box>

        <Box flex="1" mt={isMediumScreen ? 3 : 0}>
          {(selectedGeneric !== null && tabValue === 0) ||
          (selectedCRM !== null && tabValue === 1) ? (
            <DataSourceConfigurationsForm
              formSchema={formSchema}
              formData={formData}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
            />
          ) : (
            <InformationBox tabLayout={tabValue === 0 ? "Local" : "Website"} />
          )}
        </Box>
      </Box>
    </SoftBox>
  );
}

export default DataType;
