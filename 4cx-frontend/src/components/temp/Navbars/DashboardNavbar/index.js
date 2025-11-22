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
  setMiniSidenav,
  setOpenConfigurator,
  
} from "../../context";
import {
  OrganizationSwitcher,
  SignOutButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import SoftBox from "components/soft-box";
import { useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import { useState, useEffect } from "react";

import Toolbar from "@mui/material/Toolbar";
import SoftInput from "components/soft-input";
import team2 from "assets/images/team-2.jpg";
import IconButton from "@mui/material/IconButton";
import { useLocation, Link } from "react-router-dom";
import SoftTypography from "components/soft-typography";
// import NotificationItem from "../../items/NotificationItem";
import { setProjectId } from "store/features/projectIdSlice";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import { setSelectedProjectName } from "store/features/projectIdSlice";
import ProjectsList from "../../../pages/create-project/create-project-modal/project-list";
import fetchData from "../../../services/api";
import Breadcrumbs from "components/bread-crumbs";
import NotificationItem from "components/temp/Items/NotificationItem";

function DashboardNavbar({ absolute = false, light = false, isMini = false }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const { isSignedIn } = useUser();
  const { userId, orgId } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const reduxDispatch = useDispatch();

  const saveSelectedProjectToLocalStorage = (projectName) => {
    localStorage.setItem("selectedProject", projectName);
  };

  const loadSelectedProjectFromLocalStorage = () => {
    return localStorage.getItem("selectedProject");
  };

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
  }, [selectedProject]);

  useEffect(() => {
    if (orgId && userId) {
      setProjectList([]);
      setSelectedProject("");
      showProject();
    }
  }, [orgId]);

  useEffect(() => {
    if (selectedProject) {
      reduxDispatch(setSelectedProjectName(selectedProject));
      saveSelectedProjectToLocalStorage(selectedProject);
    }
  }, [selectedProject, dispatch]);

  const selectChange = (projectName) => {
    setSelectedProject(projectName);
    window.location.reload();
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
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["New message", "from Laur"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<img src={logoSpotify} alt="person" />}
        title={["New album", "by Travis Scott"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="secondary"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            payment
          </Icon>
        }
        title={["", "Payment successfully completed"]}
        date="2 days"
        onClick={handleCloseMenu}
      />
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          {/* <Icon fontSize="medium" sx={navbarDesktopMenu} onClick={handleMiniSidenav}> */}
          <Icon fontSize="medium" sx={navbarDesktopMenu}>

            {miniSidenav ? "menu_open" : "menu"}
          </Icon>
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
              <OrganizationSwitcher />
              {isSignedIn ? (
                <SignOutButton>
                  <UserButton afterSignOutUrl="/authentication/sign-in" />
                </SignOutButton>
              ) : (
                <Link to="/authentication/sign-in">
                  <IconButton sx={navbarIconButton} size="small">
                    <Icon
                      sx={({ palette: { dark, white } }) => ({
                        color: light ? white.main : dark.main,
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
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon className={light ? "text-white" : "text-dark"}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
// DashboardNavbar.defaultProps = {
//   absolute: false,
//   light: false,
//   isMini: false,
// };

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
