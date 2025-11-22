import { Router } from "express";
import multer from "multer";
import {
	deleteTenantData,
	getSourceData,
	getWebSiteUrlCount,
	getWebSiteExcelData,
	saveDataSourceConfig,
	getDataSourceConfig,
	updateDataSourceConfig,
	getFileByFileName,
	getMetricData,
} from "./controller";
import { userAuthentication } from "../../middleware/auth";

const upload = multer({ dest: "uploads/" });

const dataRoutes: any = Router();

dataRoutes
	.route("/")
	.post(getSourceData)
	.delete(userAuthentication, deleteTenantData);

// dataRoutes
// .route("/organizations/:organizationId/projects/:projectId/sourceType/:sourceType/config")
// .get(userAuthentication, getDataSourceConfig);

dataRoutes
	.post("/webUrl", getWebSiteUrlCount)
	.post("/webUrl/excel", upload.single("file"), getWebSiteExcelData);

dataRoutes
	.route("/organizations/:organizationId/projects/:projectId/config")
	.post(userAuthentication, saveDataSourceConfig)
	.put(userAuthentication, updateDataSourceConfig);

dataRoutes.route("/file/:fileName").get(getFileByFileName);

dataRoutes
	.route(
		"/organization/:organizationId/projects/:projectId/users/:userId/metric"
	)
	.get(getMetricData);

export default dataRoutes;
