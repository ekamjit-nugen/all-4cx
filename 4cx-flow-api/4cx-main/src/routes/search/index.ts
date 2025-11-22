import { Router } from "express";
import {
	createNewSearchIndex,
	getIndexesProgress,
	getIndexesProgressData,
	getSearchIndexList,
	getSearchProgress,
	getSearchSourceData,
	saveSearchProgress,
	storeRetrievalJsonData,
	updateSearchProgress,
	updateStatusProgressData,
} from "./controller";
import { userAuthentication } from "../../middleware/auth";

const searchRoutes: any = Router();

searchRoutes
	.route("/organizations/:organizationId/projects/:projectId/searchIndex")
	.get(userAuthentication, getSearchIndexList)
	.post(createNewSearchIndex);

// searchRoutes
// 	.route("/organizations/:organizationId/projects/:projectId/users/:userId/indexs/:indexId")
// 	.get(getIndexesProgress);

searchRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/indexes")
		.post(updateStatusProgressData)
 
searchRoutes.post("/sourceData", getSearchSourceData);

searchRoutes
	.route(
		"/organizations/:organizationId/projects/:projectId/users/:userId/save"
	)
	.get(getSearchProgress)
	.post(saveSearchProgress)
	.patch(updateSearchProgress);

searchRoutes
	.route(
		"/organizations/:organizationId/projects/:projectId/users/:userId/retrieval/data"
	)
	.post(storeRetrievalJsonData);

export default searchRoutes;
