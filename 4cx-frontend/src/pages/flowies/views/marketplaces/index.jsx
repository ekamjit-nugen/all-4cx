import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import {
  Box,
  Stack,
  Badge,
  ToggleButton,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Skeleton,
  FormControlLabel,
  ToggleButtonGroup,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Paper,
  checkboxClasses,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconLayoutGrid, IconList, IconX } from "@tabler/icons-react";

// project imports
import MainCard from "@/ui-component/cards/MainCard";
import ItemCard from "@/ui-component/cards/ItemCard";
import WorkflowEmptySVG from "@/assets/images/workflow_empty.svg";
import ToolDialog from "@/views/tools/ToolDialog";
import { MarketplaceTable } from "@/ui-component/table/MarketplaceTable";
import ViewHeader from "@/layout/MainLayout/ViewHeader";
import ErrorBoundary from "@/ErrorBoundary";
import { TabPanel } from "@/ui-component/tabs/TabPanel";
import {
  closeSnackbar as closeSnackbarAction,
  enqueueSnackbar as enqueueSnackbarAction,
} from "@/store/actions";
import ConfirmDialog from "@/ui-component/dialog/ConfirmDialog";

// API
import marketplacesApi from "@/api/marketplaces";

// Hooks
import useApi from "@/hooks/useApi";
import useConfirm from "@/hooks/useConfirm";

// const
import { baseURL } from "@/store/constant";
import { gridSpacing } from "@/store/constant";
import useNotifier from "@/utils/useNotifier";

const badges = ["POPULAR", "NEW"];
const types = ["Chatflow", "Agentflow", "Tool"];
const framework = ["Langchain", "LlamaIndex"];
const MenuProps = {
  PaperProps: {
    style: {
      width: 160,
    },
  },
};
const SelectStyles = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 2,
  },
};
// ==============================|| Marketplace ||============================== //

const Marketplace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useNotifier();

  const theme = useTheme();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});
  const [usecases, setUsecases] = useState([]);
  const [eligibleUsecases, setEligibleUsecases] = useState([]);
  const [selectedUsecases, setSelectedUsecases] = useState([]);

  const [showToolDialog, setShowToolDialog] = useState(false);
  const [toolDialogProps, setToolDialogProps] = useState({});

  const getAllTemplatesMarketplacesApi = useApi(marketplacesApi.getAllTemplatesFromMarketplaces);

  const [view, setView] = React.useState(localStorage.getItem("mpDisplayStyle") || "card");
  const [search, setSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [frameworkFilter, setFrameworkFilter] = useState([]);

  const getAllCustomTemplatesApi = useApi(marketplacesApi.getAllCustomTemplates);
  const [activeTabValue, setActiveTabValue] = useState(0);
  const [templateImages, setTemplateImages] = useState({});
  const [templateUsecases, setTemplateUsecases] = useState([]);
  const [eligibleTemplateUsecases, setEligibleTemplateUsecases] = useState([]);
  const [selectedTemplateUsecases, setSelectedTemplateUsecases] = useState([]);
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));
  const { confirm } = useConfirm();

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !getAllCustomTemplatesApi.data) {
      getAllCustomTemplatesApi.request();
    }
    setActiveTabValue(newValue);
  };

  const clearAllUsecases = () => {
    if (activeTabValue === 0) setSelectedUsecases([]);
    else setSelectedTemplateUsecases([]);
  };

  const handleBadgeFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setBadgeFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const data =
      activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data;
    getEligibleUsecases(data, {
      typeFilter,
      badgeFilter: typeof value === "string" ? value.split(",") : value,
      frameworkFilter,
      search,
    });
  };

  const handleTypeFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setTypeFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const data =
      activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data;
    getEligibleUsecases(data, {
      typeFilter: typeof value === "string" ? value.split(",") : value,
      badgeFilter,
      frameworkFilter,
      search,
    });
  };

  const handleFrameworkFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setFrameworkFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    const data =
      activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data;
    getEligibleUsecases(data, {
      typeFilter,
      badgeFilter,
      frameworkFilter: typeof value === "string" ? value.split(",") : value,
      search,
    });
  };

  const handleViewChange = (event, nextView) => {
    if (nextView === null) return;
    localStorage.setItem("mpDisplayStyle", nextView);
    setView(nextView);
  };

  const onSearchChange = (event) => {
    setSearch(event.target.value);
    const data =
      activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data;

    getEligibleUsecases(data, {
      typeFilter,
      badgeFilter,
      frameworkFilter,
      search: event.target.value,
    });
  };

  const onDeleteCustomTemplate = async (template) => {
    const confirmPayload = {
      title: `Delete`,
      description: `Delete Custom Template ${template.name}?`,
      confirmButtonName: "Delete",
      cancelButtonName: "Cancel",
    };
    const isConfirmed = await confirm(confirmPayload);

    if (isConfirmed) {
      try {
        const deleteResp = await marketplacesApi.deleteCustomTemplate(template.id);
        if (deleteResp.data) {
          enqueueSnackbar({
            message: "Custom Template deleted successfully!",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "success",
              action: (key) => (
                <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
                  <IconX />
                </Button>
              ),
            },
          });
          getAllCustomTemplatesApi.request();
        }
      } catch (error) {
        enqueueSnackbar({
          message: `Failed to delete custom template: ${
            typeof error.response.data === "object"
              ? error.response.data.message
              : error.response.data
          }`,
          options: {
            key: new Date().getTime() + Math.random(),
            variant: "error",
            persist: true,
            action: (key) => (
              <Button style={{ color: "white" }} onClick={() => closeSnackbar(key)}>
                <IconX />
              </Button>
            ),
          },
        });
      }
    }
  };

  const filterFlows = (data) => {
    return (
      (data.categories ? data.categories.join(",") : "")
        .toLowerCase()
        .indexOf(search.toLowerCase()) > -1 ||
      data.templateName.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      (data.description && data.description.toLowerCase().indexOf(search.toLowerCase()) > -1)
    );
  };

  const filterByBadge = (data) => {
    return badgeFilter.length > 0 ? badgeFilter.includes(data.badge) : true;
  };

  const filterByType = (data) => {
    return typeFilter.length > 0 ? typeFilter.includes(data.type) : true;
  };

  const filterByFramework = (data) => {
    return frameworkFilter.length > 0
      ? (data.framework || []).some((item) => frameworkFilter.includes(item))
      : true;
  };

  const filterByUsecases = (data) => {
    if (activeTabValue === 0)
      return selectedUsecases.length > 0
        ? (data.usecases || []).some((item) => selectedUsecases.includes(item))
        : true;
    else
      return selectedTemplateUsecases.length > 0
        ? (data.usecases || []).some((item) => selectedTemplateUsecases.includes(item))
        : true;
  };

  const getEligibleUsecases = (data, filter) => {
    if (!data) return;

    let filteredData = data;
    if (filter.badgeFilter.length > 0)
      filteredData = filteredData.filter((data) => filter.badgeFilter.includes(data.badge));
    if (filter.typeFilter.length > 0)
      filteredData = filteredData.filter((data) => filter.typeFilter.includes(data.type));
    if (filter.frameworkFilter.length > 0)
      filteredData = filteredData.filter((data) =>
        (data.framework || []).some((item) => filter.frameworkFilter.includes(item))
      );
    if (filter.search) {
      filteredData = filteredData.filter(
        (data) =>
          (data.categories ? data.categories.join(",") : "")
            .toLowerCase()
            .indexOf(filter.search.toLowerCase()) > -1 ||
          data.templateName.toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
          (data.description &&
            data.description.toLowerCase().indexOf(filter.search.toLowerCase()) > -1)
      );
    }

    const usecases = [];
    for (let i = 0; i < filteredData.length; i += 1) {
      if (filteredData[i].flowData) {
        usecases.push(...filteredData[i].usecases);
      }
    }
    if (activeTabValue === 0) setEligibleUsecases(Array.from(new Set(usecases)).sort());
    else setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort());
  };

  const onUseTemplate = (selectedTool) => {
    const dialogProp = {
      title: "Add New Tool",
      type: "IMPORT",
      cancelButtonName: "Cancel",
      confirmButtonName: "Add",
      data: selectedTool,
    };
    setToolDialogProps(dialogProp);
    setShowToolDialog(true);
  };

  const goToTool = (selectedTool) => {
    const dialogProp = {
      title: selectedTool.templateName,
      type: "TEMPLATE",
      data: selectedTool,
    };
    setToolDialogProps(dialogProp);
    setShowToolDialog(true);
  };

  const goToCanvas = (selectedChatflow) => {
    navigate(`/marketplace/${selectedChatflow.templateName}`, { state: selectedChatflow });
  };

  useEffect(() => {
    getAllTemplatesMarketplacesApi.request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(getAllTemplatesMarketplacesApi.loading);
  }, [getAllTemplatesMarketplacesApi.loading]);

  useEffect(() => {
    if (getAllTemplatesMarketplacesApi.data) {
      try {
        const flows = getAllTemplatesMarketplacesApi.data;
        const usecases = [];
        const images = {};
        for (let i = 0; i < flows.length; i += 1) {
          if (flows[i].flowData) {
            const flowDataStr = flows[i].flowData;
            const flowData = JSON.parse(flowDataStr);
            usecases.push(...flows[i].usecases);
            const nodes = flowData.nodes || [];
            images[flows[i].id] = [];
            for (let j = 0; j < nodes.length; j += 1) {
              const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`;
              if (!images[flows[i].id].includes(imageSrc)) {
                images[flows[i].id].push(imageSrc);
              }
            }
          }
        }
        setImages(images);
        setUsecases(Array.from(new Set(usecases)).sort());
        setEligibleUsecases(Array.from(new Set(usecases)).sort());
      } catch (e) {
        console.error(e);
      }
    }
  }, [getAllTemplatesMarketplacesApi.data]);

  useEffect(() => {
    if (getAllTemplatesMarketplacesApi.error) {
      setError(getAllTemplatesMarketplacesApi.error);
    }
  }, [getAllTemplatesMarketplacesApi.error]);

  useEffect(() => {
    setLoading(getAllCustomTemplatesApi.loading);
  }, [getAllCustomTemplatesApi.loading]);

  useEffect(() => {
    if (getAllCustomTemplatesApi.data) {
      try {
        const flows = getAllCustomTemplatesApi.data;
        const usecases = [];
        const tImages = {};
        for (let i = 0; i < flows.length; i += 1) {
          if (flows[i].flowData) {
            const flowDataStr = flows[i].flowData;
            const flowData = JSON.parse(flowDataStr);
            usecases.push(...flows[i].usecases);
            if (flows[i].framework) {
              flows[i].framework = [flows[i].framework] || [];
            }
            const nodes = flowData.nodes || [];
            tImages[flows[i].id] = [];
            for (let j = 0; j < nodes.length; j += 1) {
              const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`;
              if (!tImages[flows[i].id].includes(imageSrc)) {
                tImages[flows[i].id].push(imageSrc);
              }
            }
          }
        }
        setTemplateImages(tImages);
        setTemplateUsecases(Array.from(new Set(usecases)).sort());
        setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort());
      } catch (e) {
        console.error(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllCustomTemplatesApi.data]);

  useEffect(() => {
    if (getAllCustomTemplatesApi.error) {
      setError(getAllCustomTemplatesApi.error);
    }
  }, [getAllCustomTemplatesApi.error]);

  return (
    <Paper>
        <>
          <MainCard>
            {error ? (
              <ErrorBoundary error={error} />
            ) : (
              <Stack flexDirection="column">
                <ViewHeader
                  filters={
                    <>
                      <FormControl
                        sx={{
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "end",
                          minWidth: 120,
                        }}
                      >
                        <InputLabel size="small" id="filter-badge-label" sx={{ fontSize: 12 }}>
                          Tag
                        </InputLabel>
                        <Select
                          labelId="filter-badge-label"
                          id="filter-badge-checkbox"
                          size="small"
                          multiple
                          value={badgeFilter}
                          onChange={handleBadgeFilterChange}
                          input={<OutlinedInput label="Badge" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                          sx={SelectStyles}
                        >
                          {badges.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
                            >
                              <Checkbox checked={badgeFilter.indexOf(name) > -1} sx={{ p: 0 }} />
                              <ListItemText sx={{ fontSize: 12, "&>span": {fontSize:"14px"} }} primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        sx={{
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "end",
                          minWidth: 120,
                        }}
                      >
                        <InputLabel size="small" id="type-badge-label" sx={{ fontSize: 12 }}>
                          Type
                        </InputLabel>
                        <Select
                          size="small"
                          labelId="type-badge-label"
                          id="type-badge-checkbox"
                          multiple
                          value={typeFilter}
                          onChange={handleTypeFilterChange}
                          input={<OutlinedInput label="Badge" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                          sx={SelectStyles}
                        >
                          {types.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
                            >
                              <Checkbox checked={typeFilter.indexOf(name) > -1} sx={{ p: 0 }} />
                              <ListItemText sx={{"&>span": {fontSize:"14px"} }} primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        sx={{
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "end",
                          minWidth: 120,
                        }}
                      >
                        <InputLabel size="small" id="type-fw-label" sx={{ fontSize: 12 }}>
                          Framework
                        </InputLabel>
                        <Select
                          size="small"
                          labelId="type-fw-label"
                          id="type-fw-checkbox"
                          multiple
                          value={frameworkFilter}
                          onChange={handleFrameworkFilterChange}
                          input={<OutlinedInput label="Badge" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                          sx={SelectStyles}
                        >
                          {framework.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
                            >
                              <Checkbox
                                checked={frameworkFilter.indexOf(name) > -1}
                                sx={{ p: 0 }}
                              />
                              <ListItemText sx={{"&>span": {fontSize:"14px"} }} primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  }
                  onSearchChange={onSearchChange}
                  search={true}
                  searchPlaceholder="Search Name/Description/Node"
                  title="Marketplace"
                >
                  <ToggleButtonGroup
                    sx={{ borderRadius: 2, height: "100%" }}
                    value={view}
                    color="primary"
                    exclusive
                    onChange={handleViewChange}
                  >
                    <ToggleButton
                      sx={{
                        borderColor: theme.palette.grey[900] + 25,
                        borderRadius: 2,
                        color: theme?.customization?.isDarkMode ? "white" : "inherit",
                      }}
                      variant="contained"
                      value="card"
                      title="Card View"
                    >
                      <IconLayoutGrid />
                    </ToggleButton>
                    <ToggleButton
                      sx={{
                        borderColor: theme.palette.grey[900] + 25,
                        borderRadius: 2,
                        color: theme?.customization?.isDarkMode ? "white" : "inherit",
                      }}
                      variant="contained"
                      value="list"
                      title="List View"
                    >
                      <IconList />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ViewHeader>
                <Tabs
                  value={activeTabValue}
                  onChange={handleTabChange}
                  textColor="primary"
                  aria-label="tabs"
                  centered
                >
                  <Tab value={0} label="Community Templates"></Tab>
                  <Tab value={1} label="My Templates" />
                </Tabs>
                <TabPanel value={activeTabValue} index={0}>
                  <Stack
                    direction="row"
                    sx={{ gap: 2, my: 2, alignItems: "center", flexWrap: "wrap" }}
                  >
                    {usecases.map((usecase, index) => (
                      <FormControlLabel
                        key={index}
                        size="small"
                        sx={{ fontSize: 12 }}
                        control={
                          <Checkbox
                            disabled={
                              eligibleUsecases.length === 0
                                ? true
                                : !eligibleUsecases.includes(usecase)
                            }
                            color="success"
                            checked={selectedUsecases.includes(usecase)}
                            onChange={(event) => {
                              setSelectedUsecases(
                                event.target.checked
                                  ? [...selectedUsecases, usecase]
                                  : selectedUsecases.filter((item) => item !== usecase)
                              );
                            }}
                            sx={{
                              [`&, &.${checkboxClasses.checked} > svg`]: {
                                backgroundImage: selectedUsecases.includes(usecase)
                                ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"),linear-gradient(310deg, #141727, #3a416f)`
                                : 'none',
                                borderColor: selectedUsecases.includes(usecase)?'#141727':'auto',
                                borderRadius: selectedUsecases.includes(usecase)?'8px':'auto'
                              },
                            }}
                          />
                        }
                        label={
                          <>
                            <span style={{ fontSize: 12 }}>{usecase}</span>
                          </>
                        }
                      />
                    ))}
                  </Stack>
                  {selectedUsecases.length > 0 && (
                    <Button
                      sx={{ width: "max-content", mb: 2, borderRadius: "20px", color: "black" }}
                      variant="text"
                      onClick={() => clearAllUsecases()}
                      startIcon={<IconX />}
                    >
                      Clear All
                    </Button>
                  )}

                  {!view || view === "card" ? (
                    <>
                      {isLoading ? (
                        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                          <Skeleton variant="rounded" height={160} />
                          <Skeleton variant="rounded" height={160} />
                          <Skeleton variant="rounded" height={160} />
                        </Box>
                      ) : (
                        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                          {getAllTemplatesMarketplacesApi.data
                            ?.filter(filterByBadge)
                            .filter(filterByType)
                            .filter(filterFlows)
                            .filter(filterByFramework)
                            .filter(filterByUsecases)
                            .map((data, index) => (
                              <Box key={index}>
                                {data.badge && (
                                  <Badge
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      "& .MuiBadge-badge": {
                                        right: 20,
                                      },
                                    }}
                                    badgeContent={data.badge}
                                    color={data.badge === "POPULAR" ? "primary" : "error"}
                                  >
                                    {(data.type === "Chatflow" || data.type === "Agentflow") && (
                                      <ItemCard
                                        onClick={() => goToCanvas(data)}
                                        data={data}
                                        images={images[data.id]}
                                      />
                                    )}
                                    {data.type === "Tool" && (
                                      <ItemCard data={data} onClick={() => goToTool(data)} />
                                    )}
                                  </Badge>
                                )}
                                {!data.badge &&
                                  (data.type === "Chatflow" || data.type === "Agentflow") && (
                                    <ItemCard
                                      onClick={() => goToCanvas(data)}
                                      data={data}
                                      images={images[data.id]}
                                    />
                                  )}
                                {!data.badge && data.type === "Tool" && (
                                  <ItemCard data={data} onClick={() => goToTool(data)} />
                                )}
                              </Box>
                            ))}
                        </Box>
                      )}
                    </>
                  ) : (
                    <MarketplaceTable
                      data={getAllTemplatesMarketplacesApi.data}
                      filterFunction={filterFlows}
                      filterByType={filterByType}
                      filterByBadge={filterByBadge}
                      filterByFramework={filterByFramework}
                      filterByUsecases={filterByUsecases}
                      goToTool={goToTool}
                      goToCanvas={goToCanvas}
                      isLoading={isLoading}
                      setError={setError}
                    />
                  )}

                  {/* {!isLoading &&
                    (!getAllTemplatesMarketplacesApi.data ||
                      getAllTemplatesMarketplacesApi.data.length === 0) && (
                      <Stack
                        sx={{ alignItems: "center", justifyContent: "center" }}
                        flexDirection="column"
                      >
                        <Box sx={{ p: 2, height: "auto" }}>
                          <img
                            style={{ objectFit: "cover", height: "25vh", width: "auto" }}
                            src={WorkflowEmptySVG}
                            alt="WorkflowEmptySVG"
                          />
                        </Box>
                        <div>No Marketplace Yet</div>
                      </Stack>
                    )} */}
                </TabPanel>
                <TabPanel value={activeTabValue} index={1}>
                  <Stack
                    direction="row"
                    sx={{ gap: 2, my: 2, alignItems: "center", flexWrap: "wrap" }}
                  >
                    {templateUsecases.map((usecase, index) => (
                      <FormControlLabel
                        key={index}
                        size="small"
                        control={
                          <Checkbox
                            disabled={
                              eligibleTemplateUsecases.length === 0
                                ? true
                                : !eligibleTemplateUsecases.includes(usecase)
                            }
                            color="success"
                            checked={selectedTemplateUsecases.includes(usecase)}
                            onChange={(event) => {
                              setSelectedTemplateUsecases(
                                event.target.checked
                                  ? [...selectedTemplateUsecases, usecase]
                                  : selectedTemplateUsecases.filter((item) => item !== usecase)
                              );
                            }}
                          />
                        }
                        label={usecase}
                      />
                    ))}
                  </Stack>
                  {selectedTemplateUsecases.length > 0 && (
                    <Button
                      sx={{ width: "max-content", mb: 2, borderRadius: "20px", color: "black" }}
                      variant="outlined"
                      onClick={() => clearAllUsecases()}
                      startIcon={<IconX />}
                    >
                      Clear All
                    </Button>
                  )}
                  {!view || view === "card" ? (
                    <>
                      {isLoading ? (
                        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                          <Skeleton variant="rounded" height={160} />
                          <Skeleton variant="rounded" height={160} />
                          <Skeleton variant="rounded" height={160} />
                        </Box>
                      ) : (
                        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={gridSpacing}>
                          {getAllCustomTemplatesApi.data
                            ?.filter(filterByBadge)
                            .filter(filterByType)
                            .filter(filterFlows)
                            .filter(filterByFramework)
                            .filter(filterByUsecases)
                            .map((data, index) => (
                              <Box key={index}>
                                {data.badge && (
                                  <Badge
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      "& .MuiBadge-badge": {
                                        right: 20,
                                      },
                                    }}
                                    badgeContent={data.badge}
                                    color={data.badge === "POPULAR" ? "primary" : "error"}
                                  >
                                    {(data.type === "Chatflow" || data.type === "Agentflow") && (
                                      <ItemCard
                                        onClick={() => goToCanvas(data)}
                                        data={data}
                                        images={templateImages[data.id]}
                                      />
                                    )}
                                    {data.type === "Tool" && (
                                      <ItemCard data={data} onClick={() => goToTool(data)} />
                                    )}
                                  </Badge>
                                )}
                                {!data.badge &&
                                  (data.type === "Chatflow" || data.type === "Agentflow") && (
                                    <ItemCard
                                      onClick={() => goToCanvas(data)}
                                      data={data}
                                      images={templateImages[data.id]}
                                    />
                                  )}
                                {!data.badge && data.type === "Tool" && (
                                  <ItemCard data={data} onClick={() => goToTool(data)} />
                                )}
                              </Box>
                            ))}
                        </Box>
                      )}
                    </>
                  ) : (
                    <MarketplaceTable
                      data={getAllCustomTemplatesApi.data}
                      filterFunction={filterFlows}
                      filterByType={filterByType}
                      filterByBadge={filterByBadge}
                      filterByFramework={filterByFramework}
                      filterByUsecases={filterByUsecases}
                      goToTool={goToTool}
                      goToCanvas={goToCanvas}
                      isLoading={isLoading}
                      setError={setError}
                      onDelete={onDeleteCustomTemplate}
                    />
                  )}
                  {!isLoading &&
                    (!getAllCustomTemplatesApi.data ||
                      getAllCustomTemplatesApi.data.length === 0) && (
                      <Stack
                        sx={{ alignItems: "center", justifyContent: "center" }}
                        flexDirection="column"
                      >
                        <Box sx={{ p: 2, height: "auto" }}>
                          <img
                            style={{ objectFit: "cover", height: "25vh", width: "auto" }}
                            src={WorkflowEmptySVG}
                            alt="WorkflowEmptySVG"
                          />
                        </Box>
                        <div>No Saved Custom Templates</div>
                      </Stack>
                    )}
                </TabPanel>
              </Stack>
            )}
          </MainCard>
          <ToolDialog
            show={showToolDialog}
            dialogProps={toolDialogProps}
            onCancel={() => setShowToolDialog(false)}
            onConfirm={() => setShowToolDialog(false)}
            onUseTemplate={(tool) => onUseTemplate(tool)}
          ></ToolDialog>
          <ConfirmDialog />
        </>
      {/* )} */}
    </Paper>
  );
};

export default Marketplace;
