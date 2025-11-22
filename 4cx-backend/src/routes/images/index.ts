import { Router } from "express";
import { ImageAPIEntry } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const imagesRoutes: any = Router();

imagesRoutes.route("/").get(ImageAPIEntry)

export default imagesRoutes;