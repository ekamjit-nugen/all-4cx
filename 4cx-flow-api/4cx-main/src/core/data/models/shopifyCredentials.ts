import { Schema, model, Document, Types } from "mongoose";
import { IShopifyCredentials } from "../IShopifyCredentials";

const shopifyCredentialSchema = new Schema<IShopifyCredentials>(
    {
        flowId: {
            type: String,
        },
        userId: {
            type: String,
        },
        apiKey: {
            type: String,
        },
        widgetId:  {
            type: String,
        },
        type:  {
            type: String,
        },
        accessToken:  {
            type: String,
        },
        shop:  {
            type: String,
        },
        widgetType:  {
            type: String,
        },
        themeConfiguration:  {
            type: {},
        },
        defaultThemeConfiguration: {
            type: {},
        },
        isFullScreen: {
            type: Boolean,
            default: false
        },
        modelType: {
            type: String
        }
    },
    {   
        collection: "Credential",
        timestamps: true,
    }
);

const ShopifyCredentials = model<IShopifyCredentials>("Credential", shopifyCredentialSchema);

export default ShopifyCredentials;
