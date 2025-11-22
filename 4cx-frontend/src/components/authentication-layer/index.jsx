import PropTypes from "prop-types";
import { useAuth } from "@clerk/clerk-react";

import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, deleteSelectedProjectName } from "store/features/projectIdSlice";
import fetchData from "services/api";
import { publicRoutes } from "utils/publicRoutes";
import CircularIndeterminate from "components/Progress";

function AuthLayer({ children }) {
  const { isSignedIn, orgId, userId } = useAuth();
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectFetched, setIsProjectFetched] = useState(false);
  const { pathname } = useLocation();
  const router = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(orgId && userId) {
      handleTenantData()
      handleUserData()
    }
  }, [orgId, userId])

  const handleUserData = async () => {
    try {
      await fetchData("tenant/", "POST", {
        userId: userId,
      });
    } catch (error) {
      console.error("Error extracting data:", error);
    }
  };

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

  const getProjects = async () => {
    try {
      if (orgId && !project.length && userId) {
        setIsLoading(true);
        fetchData(`project/user/${userId}/organizationId/${orgId}`, "GET")
          .then((response) => {
            if(response.data && response.data.length && response.data.length !== project.length) {
              setProject(response.data);
            } else {
              setProject([]);
            }
          })
          .catch((error) => console.log("error", error))
          .finally(() => {
            setIsProjectFetched(true);
            setIsLoading(false);
          });
      } else if (orgId && project) {
        router("/");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (orgId && !project.length) {
      getProjects();
    } else {
      setIsLoading(false);
    }
  }, [orgId, isSignedIn, pathname, router, project.length]);

  useEffect(() => {
    if (isSignedIn && userId) {
      setProject([]);
      dispatch(deleteSelectedProjectName());
    }
  }, [isSignedIn, userId, dispatch]);

  useLayoutEffect(() => {
    if (
      typeof isSignedIn === "boolean" &&
      !isSignedIn &&
      !publicRoutes.includes(pathname) &&
      !(
        pathname.startsWith("/authentication/sign-in") ||
        pathname.startsWith("/authentication/sign-up")
      )
    ) {
      return router("/authentication/sign-in");
    }

    if (typeof isSignedIn === "boolean" && isSignedIn && !orgId) {
      return router("/create-organization");
    }

    if (isProjectFetched) {
      // if (typeof isSignedIn === "boolean" && isSignedIn && orgId && project.length === 0 && orgRole==="org:member") {
      //   dispatch(deleteSelectedProjectName(""));
      //   return router("/requestAccessPage");
      // }
      if (typeof isSignedIn === "boolean" && isSignedIn && orgId && project.length === 0) {
        dispatch(deleteSelectedProjectName(""));
        return router("/create-project");
      }

      if (typeof isSignedIn === "boolean" && isSignedIn && orgId && project.length > 0) {
        dispatch(
          setUser({
            user: { id: userId },
            orgId: orgId,
            userId: userId,
          })
        );

        if (pathname === "/create-project" && isSignedIn && orgId && project.length > 0) {
          return router("/");
        }
      }
    }
  }, [isSignedIn, pathname, router, orgId, userId, isProjectFetched, project]);

  if (typeof isSignedIn === "undefined" && isLoading) {
    return <CircularIndeterminate />;
  }
  return <>{children}</>;
}

AuthLayer.propTypes = {
  children: PropTypes.element,
};

export default AuthLayer;
