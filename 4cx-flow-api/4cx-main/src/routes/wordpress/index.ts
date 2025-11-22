import { Router } from "express";
import { getCredentials, saveCredentials } from "./controller";
 
const wordPressRoutes: any = Router();
 
wordPressRoutes.route("/credentials")
        .get(getCredentials)        
        .post(saveCredentials)
       
export default wordPressRoutes;
 