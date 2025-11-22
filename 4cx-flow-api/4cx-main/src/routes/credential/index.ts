import { Router } from "express";
import { getCredentialsById, saveCredentials } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const credentialRoutes: any = Router();

credentialRoutes.route("/")
    .post(saveCredentials)

// credentialRoutes.route("/:credentialId")
//     .get(getCredentialsById)
//     .put(updateCredentials)

credentialRoutes.route("/organizations/:organizationId/projects/:projectId")
    .get(userAuthentication, getCredentialsById)
    // .get(userAuthentication, getCredentialsById)



export default credentialRoutes;