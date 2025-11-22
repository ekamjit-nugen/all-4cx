import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ShopifyCredentialsModel } from "../../core/data/models";
import ShopifyUserSession from "../../core/data/models/shopifyUserSession";

export const createNewSearchIndex = async (req: Request, res: Response) => {
  //   const logService = "INDEXES";
  //   const logType = "create_indexes";
  try {
    const { shopName } = req.params;
    let query = {
      shop_name: shopName,
      chat_id: uuidv4(),
    };
    // console.log(query);

    const userSessionData = await ShopifyUserSession.create(query);
    return res.status(200).json({ data: userSessionData });
  } catch (error: any) {
    // createErrorLog({
    //   userId: clerk_id,
    //   organizationId,
    //   projectId,
    //   service: logService,
    //   type: logType,
    //   message: error.message,
    // })
    if (error.message == "Invalid input") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message == "Search index title already exist") {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Default theme configuration as given in the original code
const defaultThemeConfiguration = {
  "header-component": {
    backgroundColor: "#ecf0fa",
    textColor: "#0c0b0b",
    fontFamily: "Arial",
    fontSize: "28px",
  },
  "avatar-component": {
    backgroundColor: "#7b95fe",
    textColor: "#ffffff",
  },
  "message-container-component": {
    backgroundColor: "#fbe7e5",
    textColor: "#070011",
    fontFamily: "Arial",
    fontSize: "18px",
  },
  "bot-message-container": {
    backgroundColor: "#c9defa",
    textColor: "#100f0f",
    fontFamily: "Arial",
    fontSize: "18px",
  },
  "send-button-component": {
    backgroundColor: "#f99a8b",
  },
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
          defaultThemeConfiguration,
          shop,
          widgetType: type,
          isFullScreen,
          modelType: modelType
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
        defaultThemeConfiguration,
        shop,
        widgetType: type,
        isFullScreen,
        modelType: modelType
      });
    }

    return res.status(201).json({ success: true, credential: newCredential });
  } catch (error) {
    console.error("Error saving credential:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
