import routes from "./routes";
import theme from "assets/theme";
import createCache from "@emotion/cache";
import { useSelector } from "react-redux";
import rtlPlugin from "stylis-plugin-rtl";
import Sidenav from "components/Sidenav";
import themeRTL from "assets/theme/theme-rtl";
import brand from "assets/images/logo-ct.png";
import { CacheProvider } from "@emotion/react";
import { useState, useEffect, useMemo } from "react";
import Configurator from "components/Configurator";
import DashboardNavbar from "./components/navbars/dashboard-navbar";
import { ClerkProvider, SignedIn, } from "@clerk/clerk-react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "./components/layout-containers/DashboardLayout";
import { useSoftUIController, setMiniSidenav } from "./components/context";
import Error404 from "./pages/error/404";
import { SnackbarProvider } from "hooks/useSnackBar";
import AuthLayer from "components/authentication-layer";
import useSocket from "hooks/socket";
import { setNotificationStatus } from "store/features/socketSlice";
import { useDispatch } from "react-redux";
import fetchData from "services/api";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import NavigationScroll from "@/layout/NavigationScroll";
import RouteChangeNotifier from "components/routeChangeNotifier";
import NotificationSidebar from "components/temp/Items/NotificationItem/NotificationSideBar";
import { indexDataSources } from "store/features/socketSlice";
import { updateIndexStatus } from "store/features/socketSlice";

export default function App() {
  const PUBLISHABLE_KEY = process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [rtlCache, setRtlCache] = useState(null);
  const [controller, dispatch] = useSoftUIController();
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const selectedProject = useSelector((state) => state.projectIdList.selectedProjectName);
  const reduxDispatch = useDispatch();
  const projectId = useSelector((state) => state.projectIdList)
  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const { socket } = useSocket();

  useEffect(() => {
    if (socket?.connected && projectId?.userId && projectId?.projectId && projectId?.orgId) {
        socket.emit('room',projectId?.userId)
        socket.on("notification", (args) => {
          console.log(args?.title,"argss..")

          if(args?.title === 'Indexes are Completed'){
            setTimeout(() => {
              reduxDispatch(updateIndexStatus('complete'))
            }, 2000);
          }
            const data = {
              service: args?.service,
              title: args?.title,
              status: args?.status,
              createdAt: args?.createdAt,
            };
              handleSaveNotification(data)
              // reduxDispatch(setExtractPrompt(data));
              reduxDispatch(setNotificationStatus(true))
              
            // if (projectId?.projectId && args?.status === "Completed" || args?.status === "Failed") {
            //   handleSaveNotification(args);
            // }
          

        });
      }
  }, [socket?.connected,projectId?.projectId , projectId?.userId]);

  const handleSaveNotification = async (payload) => {
    try {
      const response = fetchData(
        `/notification/organizations/${projectId?.orgId}/projects/${projectId?.projectId}/user/${projectId?.userId}/notification
      `,
        "POST",
        payload
      );
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return direction === "rtl" ? (
    <StyledEngineProvider injectFirst>
      {/* <ThemeProvider theme={themes(customization || themeRTL || theme)}> */}
        <CssBaseline />
        <NavigationScroll>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY} routerPush={(to) => navigate(to)}>
            <AuthLayer>
              <RouteChangeNotifier />
              <CacheProvider value={rtlCache}>
                <ThemeProvider theme={themeRTL}>
                  <CssBaseline />
                  <SnackbarProvider>
                    <SignedIn>
                      {pathname !== "/create-organization" &&
                        pathname !== "/create-project" &&
                        layout === "dashboard" &&
                        pathname != "/newTest" && (
                          <>
                            <Sidenav
                              color={sidenavColor}
                              brand={brand}
                              brandName="4CX.AI"
                              routes={routes}
                              // onMouseEnter={handleOnMouseEnter}
                              // onMouseLeave={handleOnMouseLeave}
                              selectedProjectName={selectedProject}
                            />
                            <Configurator />
                            <NotificationSidebar/>
                            {/* {configsButton} */}
                          </>
                        )}
                    </SignedIn>
                    {layout === "vr" && <Configurator />}
                    <Routes>
                      {getRoutes(routes)}
                      {/* <Route path="*" element={<Navigate to="/" />} /> */}
                    </Routes>
                  </SnackbarProvider>
                </ThemeProvider>
              </CacheProvider>
            </AuthLayer>
          </ClerkProvider>
        </NavigationScroll>
      {/* </ThemeProvider> */}
    </StyledEngineProvider>
  ) : (
    <StyledEngineProvider injectFirst>
      {/* <ThemeProvider theme={themes(customization)}> */}
        <CssBaseline />
        <NavigationScroll>
          <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
          >
            <AuthLayer>
            <RouteChangeNotifier />
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider>
                  <SignedIn>
                    {pathname !== "/create-organization" &&
                      pathname !== "/create-project" &&
                      layout === "dashboard" &&
                      pathname != "/newTest" && pathname != "/requestAccessPage"  && pathname != "/unauthorizedAccess" && (
                        <>
                          <Sidenav
                            color={sidenavColor}
                            brand={brand}
                            brandName="4CX.AI"
                            routes={routes.filter(({ name }) => name != "Authentication")}
                            // onMouseEnter={handleOnMouseEnter}
                            // onMouseLeave={handleOnMouseLeave}
                            selectedProjectName={selectedProject}
                          />
                          <Configurator />
                          <NotificationSidebar/>
                          {/* {configsButton} */}
                        </>
                      )}
                  </SignedIn>
                  {layout === "vr" && <Configurator />}
                  {pathname != "/authentication/sign-in" &&
                  pathname != "/authentication/sign-in/factor-one" &&
                  pathname != "/authentication/sign-up" &&
                  pathname != "/authentication/sign-up/verify-email-address" &&
                  pathname != "/create-organization" &&
                  pathname != "/create-project" &&
                  pathname != "/newTest" &&  pathname != "/requestAccessPage" && pathname != "/unauthorizedAccess"? (
                    <DashboardLayout>
                      <DashboardNavbar />
                      <Routes>
                        {getRoutes(routes)}
                        <Route path="*" element={<Error404 />} />
                      </Routes>
                    </DashboardLayout>
                  ) : (
                    <Routes>
                      {getRoutes(routes)}
                      <Route path="*" element={<Error404 />} />
                    </Routes>
                  )}
                </SnackbarProvider>
              </ThemeProvider>
            </AuthLayer>
          </ClerkProvider>
        </NavigationScroll>
      {/* </ThemeProvider> */}
    </StyledEngineProvider>
  );
}
