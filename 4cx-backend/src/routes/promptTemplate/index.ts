import { Router } from "express";
import { createPromptTemplate, getPromptTemplate, clonePromptTemplate } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const promptTemplateRoutes: any = Router();

promptTemplateRoutes
    .route("/")
        .post(  createPromptTemplate)

promptTemplateRoutes
    .route("/organizations/:organizationId/projects/:projectId/template")
        .get( getPromptTemplate)
        .post( clonePromptTemplate)


export default promptTemplateRoutes;
