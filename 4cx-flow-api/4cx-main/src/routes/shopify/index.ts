import { Router } from "express";
import { createNewSearchIndex, saveCredentials } from "./controller";
 
const shopifyRoutes: any = Router();
 
shopifyRoutes.route("/session/shopName/:shopName")
        .get(createNewSearchIndex)
        
        .post(saveCredentials)
      
 
export default shopifyRoutes;
 