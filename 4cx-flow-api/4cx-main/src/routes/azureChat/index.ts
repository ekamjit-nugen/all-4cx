import { Router } from "express";
import { getCdnFileData, saveChat } from "./controller";
import { userAuthentication } from "../../middleware/auth";

const chatRoutes: any = Router();

// chatRoutes.post("/", saveChat) //orchestarte-old chat
chatRoutes.get("/", getCdnFileData) //orchestarte-old chat


export default chatRoutes;
