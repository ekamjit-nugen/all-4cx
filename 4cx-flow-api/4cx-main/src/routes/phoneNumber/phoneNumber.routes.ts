import { Router } from "express";
import {
	createPhoneNumber,
	getPhoneNumbers,
	purchasePhoneNumber,
	releasePhoneNumbers,
} from "./phoneNumber.controller";

const phoneNumberRoutes = Router();

phoneNumberRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/save")
	.post(createPhoneNumber);

phoneNumberRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/numbers")
	.get(getPhoneNumbers)
	.put(purchasePhoneNumber)
	.patch(releasePhoneNumbers);

export default phoneNumberRoutes;
