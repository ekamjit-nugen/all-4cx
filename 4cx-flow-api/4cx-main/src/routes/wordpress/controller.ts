import { Request, Response } from "express";
import { ShopifyCredentialsModel } from "../../core/data/models";

export const getCredentials = async (req: Request, res: Response) => {
  try {
    const { shop, type } = req.query;
    const existingCredential = await ShopifyCredentialsModel.findOne({
      shop,
      widgetType: type,
    });

    return res
      .status(200)
      .json({ success: true, credential: existingCredential , message:!!existingCredential? `Credential found successfully for ${shop} shop`: `No credential found for ${shop} shop` });
  } catch (error) {
    console.error("Error saving credential:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const saveCredentials = async (req: Request, res: Response) => {
  try {
    const {
      flowId,
      userId,
      apiKey,
      widgetId,
      accessToken,
      themeConfiguration,
      shop,
      type,
      isFullScreen = false,
      modelType
    } = req.body;

    if (!flowId || !userId || !apiKey || !widgetId || !shop || !type || !modelType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingCredential = await ShopifyCredentialsModel.findOne({
      shop,
      widgetType: type,
    });

    let newCredential;

    if (existingCredential) {
      // Update the existing record
      newCredential = await ShopifyCredentialsModel.findByIdAndUpdate(
        existingCredential._id,
        {
          flowId,
          userId,
          apiKey,
          widgetId,
          accessToken,
          themeConfiguration,
          defaultThemeConfiguration: themeConfiguration,
          shop,
          widgetType: type,
          isFullScreen,
          modelType,
        },
        { new: true }
      );
    } else {
      // Create a new record
      newCredential = await ShopifyCredentialsModel.create({
        flowId,
        userId,
        apiKey,
        widgetId,
        accessToken,
        themeConfiguration,
        defaultThemeConfiguration: themeConfiguration,
        shop,
        widgetType: type,
        isFullScreen,
        modelType,
      });
    }

    return res.status(201).json({ success: true, credential: newCredential });
  } catch (error) {
    console.error("Error saving credential:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
