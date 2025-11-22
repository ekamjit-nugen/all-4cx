import { Router } from "express";
import { getSearchIndexList, getSearchProgress, getSearchSourceData, saveSearchProgress, storeRetrievalJsonData, updateSearchProgress } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const searchRoutes: any = Router()

searchRoutes.route("/organizations/:organizationId/projects/:projectId/searchIndex")
    .get(userAuthentication, getSearchIndexList)
    // .post(userAuthentication, createNewSearchIndex);

searchRoutes.post("/sourceData", getSearchSourceData);

searchRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/save")
    .get(getSearchProgress)
    .post(saveSearchProgress)
    .patch(updateSearchProgress)

searchRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/retrieval/data")
    .post(storeRetrievalJsonData)

export default searchRoutes;
