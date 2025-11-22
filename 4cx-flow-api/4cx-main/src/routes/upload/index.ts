import { Router } from "express";
import {
	updateLocalSourceData,
	uploadLocalSourceData,
	uploadWebsiteSourceData,
} from "./controller";
import multer from "multer";
import { userAuthentication } from "../../middleware/auth";

const uploadRoutes: any = Router();

const upload = multer({ dest: "uploads/" });
uploadRoutes.route("/file")
	.post(upload.array("files"), uploadLocalSourceData)
	.put(upload.single("file"), updateLocalSourceData);

uploadRoutes.post("/webSourceData", uploadWebsiteSourceData);

export default uploadRoutes;
