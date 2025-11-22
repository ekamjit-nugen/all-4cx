import { Router } from "express";
import multer from "multer";
import { deleteTenantData, getSourceData, getWebSiteUrlCount, getWebSiteExcelData, saveDataSourceConfig, getDataSourceConfig, updateDataSourceConfig } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const upload = multer({ dest: 'uploads/' })

const dataRoutes: any = Router();
dataRoutes
    .route("/")
        .post(getSourceData)
        .delete(userAuthentication, deleteTenantData)

// dataRoutes
    // .route("/organizations/:organizationId/projects/:projectId/sourceType/:sourceType/config")
    // .get(userAuthentication, getDataSourceConfig);
        
dataRoutes
    .post("/webUrl", getWebSiteUrlCount)
    .post("/webUrl/xl-file",  upload.single("file"), getWebSiteExcelData)

dataRoutes.route("/organizations/:organizationId/projects/:projectId/config")
    .post( userAuthentication, saveDataSourceConfig)
    .put( userAuthentication, updateDataSourceConfig)


export default dataRoutes;
