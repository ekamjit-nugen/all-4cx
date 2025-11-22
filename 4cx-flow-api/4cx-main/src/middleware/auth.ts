import { Request, Response, NextFunction } from "express";
import { TenantModel } from "../core/data/models";
export interface AuthenticatedRequest extends Request {
	userInfo: any
}

export const userAuthentication = async ( req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        let userId = req.headers["user_id"];
        if( !userId){
            throw new Error("Invalid userId in headers");
        }
        let user = await TenantModel.aggregate([
            {
                $match: {
                    clerk_id: userId,
                    is_deleted: false,
                    is_active: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    clerk_id: 1,
                    name: 1,
                    username: 1,
                    email: 1,
                    is_active: 1,
                    is_deleted: 1,
                },
            },
        ]);
        if (user.length == 0) {
            throw new Error("Unauthorized access")
        }
        req.userInfo = {};
        req.userInfo = user[0];
        next();
    }
    catch(error: any){
		if (error.message == "Invalid userId in headers") {
			return res.status(400).json({ error: error.message});
		}
        if (error.message == "Unauthorized access") {
			return res.status(401).json({ error: error.message});
        }
		console.log(error.message);
		return res.status(500).json({ error: "Internal server error" }); 
    }
}