import { Router } from "express";
import {
	addTenant,
	addTenantOrganizationData,
	getTenantOrgMembers,
} from "./controller";
import { userAuthentication } from "../../middleware/auth";
 
const userRoutes: any = Router();
 
userRoutes
	.route("/")
		.post( addTenant)

userRoutes
	// .route("/organizations")
	.get("/:orgId",  getTenantOrgMembers)
	.post("/organization", addTenantOrganizationData);
 
export default userRoutes;
 