import { Schema, model } from "mongoose";
import { IShopifyUseSession } from "../IShopifyUserSession";

const ShopifyUserSessionModel = new Schema<IShopifyUseSession>(
    {
        shop_name: {
            type: String,
            required: true,
        },
        chat_id: {
            type: String,
            required: true,
        }
    },
    {   
        collection: "shopify_user_session",
        timestamps: true,
    }
);

const ShopifyUserSession = model<IShopifyUseSession>("ShopifyUserSession", ShopifyUserSessionModel);

export default ShopifyUserSession;
