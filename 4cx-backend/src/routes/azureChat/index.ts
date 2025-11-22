import { Router } from "express";
import { saveChat } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const chatRoutes: any = Router();

chatRoutes.post("/", saveChat)

export default chatRoutes;
