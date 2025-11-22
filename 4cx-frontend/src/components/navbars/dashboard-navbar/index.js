import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "./styles";
import {
  useSoftUIController,
  setTransparentNavbar,
  setOpenConfigurator,
  setOpenConfiguratorNotification,
} from "../../context";
import {
  OrganizationSwitcher,
  SignOutButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import SoftBox from "components/soft-box";
import { useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import { useState, useEffect, useRef } from "react";

import Toolbar from "@mui/material/Toolbar";
import SoftInput from "components/soft-input";
import IconButton from "@mui/material/IconButton";
import { useLocation, Link, useNavigate } from "react-router-dom";
import SoftTypography from "components/soft-typography";
import { setProjectId } from "store/features/projectIdSlice";
import { setSelectedProjectName } from "store/features/projectIdSlice";
import ProjectsList from "../../../pages/create-project/create-project-modal/project-list";
import fetchData from "../../../services/api";
import Breadcrumbs from "components/bread-crumbs";
import { useSelector } from "react-redux";
import { Avatar, ButtonBase, Typography, useTheme } from "@mui/material";
import { setExtractPrompt } from "store/features/socketSlice";
import { clearExtractReduxData } from "store/features/socketSlice";
import { IconPlus } from "@tabler/icons-react";
import { setNotificationStatus } from "store/features/socketSlice";

function DashboardNavbar({ absolute = false, light = false, isMini = false }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, OpenConfiguratorNotification } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const { isSignedIn } = useUser();
  const { isActive } = useSelector((state) => state.fileUpload);
  const notificationStatus = useSelector((state) => state.socket.notificationStatus);
  const menuButtonRef = useRef(null);
  const projectId = useSelector((state) => state.projectIdList);
  const { userId, orgId,orgRole } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const reduxDispatch = useDispatch();
  const navigate = useNavigate()
  const theme = useTheme();
  const {state} = useLocation()
  const flowName = state ? state.name : ''

  const saveSelectedProjectToLocalStorage = (projectName) => {
    localStorage.setItem("selectedProject", projectName);
  };

  const loadSelectedProjectFromLocalStorage = () => {
    return localStorage.getItem("selectedProject");
  };
  const orgValueId=localStorage.getItem("orgId")
  const showProject = () => {
    fetchData(`project/user/${userId}/organizationId/${orgId}`, "GET")
      .then((response) => {
        let data = response.data;
        let projectTitle = data.map((project) => project.title);
        let projectId = data.map((project) => project._id);
        setProjectList(projectTitle);

        const storedProject = loadSelectedProjectFromLocalStorage();
        if (storedProject && projectTitle.includes(storedProject)) {
          setSelectedProject(storedProject);
          const selectedProjectId = projectId[projectTitle.indexOf(storedProject)];
          reduxDispatch(setProjectId({ projectId: selectedProjectId }));
        } else if (projectTitle.length > 0) {
          const defaultProject = projectTitle[0];
          setSelectedProject(defaultProject);
          reduxDispatch(setSelectedProjectName(defaultProject));
          const defaultProjectId = projectId[0];
          reduxDispatch(setProjectId({ projectId: defaultProjectId }));
          saveSelectedProjectToLocalStorage(defaultProject);
        }
      })
      .catch((error) => console.log("error from showProject ", error));
  };

  useEffect(() => {
    if (orgId && userId) {
      showProject();
    }
  }, [selectedProject,openConfigurator]);

  useEffect(() => {
    if (orgId && userId) {
      setProjectList([]);
      setSelectedProject("");
      showProject();
      localStorage.setItem("orgId",orgId)
    }
  }, [orgId,openConfigurator]);
  
  useEffect(()=>{
    if(orgId===orgValueId){
      navigate('/')
    }
  },[orgValueId])
  useEffect(() => {
    if (selectedProject) {
      reduxDispatch(setSelectedProjectName(selectedProject));
      saveSelectedProjectToLocalStorage(selectedProject);
    }
  }, [selectedProject, dispatch]);

  const selectChange = (projectName) => {
    setSelectedProject(projectName);
    navigate("/")
  };
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleNotificationConfiguratorOpen = () => setOpenConfiguratorNotification(dispatch, !OpenConfiguratorNotification);

  const handleOpenMenu = (event) => {
    handleNotificationConfiguratorOpen()
    reduxDispatch(setNotificationStatus(false))
    setOpenMenu(true);
    menuButtonRef.current = event.currentTarget; // Step 2
  };
  useEffect(() => {
    if (openMenu && projectId.orgId && projectId.projectId && projectId.userId) {
      fetchNotification();
    }
  }, [openMenu, projectId,OpenConfiguratorNotification]);

  const fetchNotification = async () => {
    try {
      const response = await fetchData(
        `/notification/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/user/${projectId?.userId}/notification
      `,
        "GET"
      );
            reduxDispatch(setExtractPrompt(response?.data));
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };
  useEffect(() => {
    if (isActive === true && menuButtonRef.current) setOpenMenu(true);

    if (isActive === false && menuButtonRef.current) setOpenMenu(false);
  }, [isActive]);

  useEffect(() => {
    if (menuButtonRef.current === null) {
      menuButtonRef.current = document.querySelector("#notification-button");
    }
  }, []);

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={flowName? flowName : `${route[route.length - 1].replace(/%20/g," ")}`} route={route} light={light} projectName={selectedProject}/>
          {/* <Icon fontSize="medium" sx={navbarDesktopMenu} onClick={handleMiniSidenav}> */}
          {/* <Icon fontSize="medium" sx={navbarDesktopMenu}>

            {miniSidenav ? "menu_open" : "menu"}
          </Icon> */}
        </SoftBox>
        {isMini ? null : (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox pr={1}>
              <SoftInput
                placeholder="Type here..."
                icon={{ component: "search", direction: "left" }}
              />
            </SoftBox>
            <SoftBox
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
              color={light ? "white" : "inherit"}
            >
              <ProjectsList
                projectList={projectList}
                selectedProject={selectedProject}
                selectChange={selectChange}
              />
              <OrganizationSwitcher hidePersonal={true}/>
              {orgRole==="org:admin" && <ButtonBase title="Create Organization" sx={{ borderRadius: "50%" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: "all .2s ease-in-out",
                    background: "#333b63",
                    color: "#ffffff",
                    "&:hover": {
                      opacity: 0.6,
                    },
                    width:"20px",
                    height:"20px",
                    marginRight:"8px",
                    borderRadius:"5px"
                  }}
                  onClick={() => {navigate('/create-organization')}}
                >
                  <IconPlus className="w-4 h-4"/>
                </Avatar>
              </ButtonBase>}
              {isSignedIn ? (
                <SignOutButton>
                  <UserButton afterSignOutUrl="/authentication/sign-in" />
                </SignOutButton>
              ) : (
                <Link to="/authentication/sign-in">
                  <IconButton sx={navbarIconButton} size="small">
                    <Icon
                      sx={({ palette: { dark, white } }) => ({
                        color: light ? white?.main : dark?.main,
                      })}
                    >
                      account_circle
                    </Icon>
                    <SoftTypography
                      variant="button"
                      fontWeight="medium"
                      color={light ? "white" : "dark"}
                    >
                      Sign In
                    </SoftTypography>
                  </IconButton>
                </Link>
              )}
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                // onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon>settings</Icon>
              </IconButton>
              <IconButton
                id="notification-button"
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}  
              >
                <Icon className={light ? "text-white" : "text-dark" } onClick={()=>{reduxDispatch(setNotificationStatus(false))}}>notifications</Icon>
                {notificationStatus && <p className="icon-button__badge"></p>}
              </IconButton>
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
