import { Router } from "express";
import {
	createOutboundCall,
	createOutboundJob,
	deleteOutboundCall,
	editOutboundCall,
	getOutboundCall,
	getOutboundCallCallId,
	getOutboundCallStatus,
	getOutboundJobs
} from "./controller";

const outboundNumberRoutes = Router();

outboundNumberRoutes
	.route("/organizations/:organizationId/projects/:projectId/users/:userId/outboundCall/:outboundJobId/call")
		.get(getOutboundCall)
		.post(createOutboundCall);

outboundNumberRoutes
	.route("/:outboundCallId/call")
		.put(editOutboundCall)
		.delete(deleteOutboundCall);

outboundNumberRoutes
    .route("/organizations/:organizationId/projects/:projectId/users/:userId/outboundJob")
		.get(getOutboundJobs)
		.post(createOutboundJob);
 
outboundNumberRoutes
    .route("/status")
		.post(getOutboundCallCallId)
 
outboundNumberRoutes
	.route("/organizations/:organizationId/projects/:projectId/status")
		.get(getOutboundCallStatus);
 
export default outboundNumberRoutes