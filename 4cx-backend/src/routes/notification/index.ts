import { Router } from "express";
import { clearALLNotification, clearNotification, createNotification, getAllNotification } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const notificationRoutes: any = Router();

notificationRoutes.route("/organizations/:organizationId/projects/:projectId/user/:userId/notification")
    .get(getAllNotification)
    .post(createNotification)
    .delete(clearALLNotification)

notificationRoutes.route("/")
    .get(userAuthentication, clearNotification)

export default notificationRoutes;