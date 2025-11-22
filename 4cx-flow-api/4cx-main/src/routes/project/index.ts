import {Router} from "express";
import { addCollaboratorsToProject, checkTenantProjectExist, createTenantProject, getProjectDataById } from "./controller";

const projectRoutes: any = Router();

projectRoutes.get("/user/:userId/organizationId/:organizationId", checkTenantProjectExist);
// projectRoutes.get("/users/:userId/organizations/:organizationId", checkTenantProjectExist);
projectRoutes.get("/id/:projectId", getProjectDataById);
// projectRoutes.get("/projects/:projectId", getProjectDataById);

projectRoutes.post("/", createTenantProject)
    .put("/", addCollaboratorsToProject);


export default projectRoutes;
