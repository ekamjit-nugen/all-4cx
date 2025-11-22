import { Request, Response } from "express";
import { createErrorLog, createSuccessLog } from "../../utils/commonhelper";
import { IWidgetList } from "../../core/data/IWidgetList";
import {Types, UpdateQuery} from "mongoose"
import { generateAPIKeyByEncryption } from "../../utils/api-key";
import { OrchestrateModel, ShopifyCredentialsModel, TenantModel, WidgetListModel, WidgetModel } from "../../core/data/models";
import { getChatSessionId } from "./widget.services";

export const validateCredentials = async ( req: Request, res: Response)=> {
  const logService = "WIDGET";
  const logType = "validate_credentials";
  try{

  const { userId, apiKey, widgetId, flowId } = req.body;

  if (!userId || !apiKey || !widgetId|| !flowId) {
    throw new Error("Invalid input");
  }
   
  const validateUser = await TenantModel.findOne({
    clerk_id: userId,
    is_active: true,
    is_deleted: false,
  });
  
  if (!validateUser) throw new Error("userId is not Valid.");

  const validateApiKey = await TenantModel.findOne({
    clerk_id: userId,
    api_key: apiKey
  });

  if (!validateApiKey) throw new Error("Api key is not Valid.");

  const validateWidgetId = await WidgetListModel.findOne({
    _id: widgetId,
    user_id: userId,
  });

  if (!validateWidgetId) throw new Error("WidgetId is not Valid.");

  const validateFlowId = await OrchestrateModel.findOne({
    flowise_id: flowId,
    author: userId,
  });

  if(!validateFlowId) throw new Error("FlowId is not valid.");

  return res.status(200).json({ message: "Api key verified."});
  }
  catch(error: any){
    console.log(error.message);
    if ( error.message == "Invalid input") {
      return res.status(401).json({error: error.message});
    } 
    if (error.message == "userId is not Valid.") {
      return res.status(401).json({error: error.message});
    }
    if (error.message == "Api key is not Valid.") {
      return res.status(401).json({error: error.message});
    }
    if (error.message == "WidgetId is not Valid.") {
      return res.status(401).json({error: error.message});
    }
    if (error.message == "FlowId is not valid.") {
      return res.status(401).json({error: error.message});
    }
    if (error.message == "Internal server error") {
      return res.status(500).json({error: error.message});
    }
  }
}

export const getShopifyCredentialsData = async (req: Request, res: Response)=> {
  try {
    let { shopName, widgetType } = req.body;

    if (!shopName || !widgetType ) {
      return res.status(400).json({error: "Invalid input"});
    }

    const shopifyCredentialsInfo = await ShopifyCredentialsModel.findOne({
      shop: shopName,
      widgetType: widgetType,
    })

    return res.status(200).json({ data: shopifyCredentialsInfo || {} });

  }catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error"} );
  }
}

export const getDefaultThemeConfig = async ( req: Request, res: Response) => {
  try {
    const { widgetId } = req.query; 
    if ( !widgetId) {
      return res.status(400).json({ error: "Invalid input"});
    }
    const widgetInfo = await WidgetModel.findOne(
      {
        _id: widgetId,
      }
    );
    if (!widgetInfo) {
      return res.status(404).json({error: "Widget data not found."})
    }
    const getResponseData = await WidgetListModel.findOne({
      _id: widgetInfo.widget_configuration_id,
    })


    return res.status(200).json({ data : getResponseData?.themeConfiguration });
  }
  catch(error: any) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal server error"} );
  }
}

export const resetThemeCssConfig = async ( req: Request, res: Response) => {
  try {
    const { widgetId, shop } = req.query; 
    if ( !widgetId) {
      return res.status(400).json({ error: "Invalid input"});
    }
    const credentialInfo = await ShopifyCredentialsModel.findOne({widgetId: widgetId, shop: shop });

    if (!credentialInfo) {
      return res.status(404).json({ error: "Widget not found." })
    }
    let pipeline: any = [
      {
        $match: {
          _id: new Types.ObjectId(credentialInfo.widgetId)
        }
      },
      {
        $lookup: {
          from: "widget_List",
          localField: "widget_configuration_id",
          foreignField: "_id",
          as: "widgetInfo"
        }
      },
      {
        $unwind: {
          path: "$widgetInfo",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          themeConfiguration:
            "$widgetInfo.themeConfiguration"
        }
      }
    ];
    const widgetInfo = await WidgetModel.aggregate(pipeline);

    if ( widgetInfo.length > 0) {
      await ShopifyCredentialsModel.updateOne(
        {
          widgetId: widgetId,
          shop: shop
        },
        {
          $set: {
            themeConfiguration: widgetInfo[0].themeConfiguration,
          }
        }
      );
    }
    
    let widget = await ShopifyCredentialsModel.findOne({widgetId: widgetId, shop: shop});
    return res.status(200).json({ message : "CssTheme is restored to default", themeConfiguration: widget?.themeConfiguration });
  }
  catch(error: any) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal server error"} );
  }
}



export const saveWidgetConfiguration = async (req: Request, res: Response): Promise<Response> => {
  const logService = "WIDGET";
  const logType = "save_widget_configuration";

  const { organizationId, projectId, userId } = req.params;
  let { widgetName, widgetType, widgetSource, widgetSourceVersion, framework, designTemplate = 1, flow_id, themeConfiguration } = req.body;

  try {
    // Validate required parameters
    if (!organizationId || !projectId || !userId) {
      return res.status(400).json({ error: "Missing required parameters: organizationId, projectId, or userId" });
    }

    // Validate required body properties
    if (!widgetName || !widgetType || !widgetSource || !framework) {
      return res.status(400).json({ error: "Missing required widget properties in request body" });
    }

    // if version is not available not available in the payload
    if(!widgetSourceVersion) widgetSourceVersion = 1;

    let chatSessionId = await getChatSessionId();

    // Create a new widget configuration
    const newWidgetConfiguration: IWidgetList = new WidgetListModel({
      widgetName,
      projectId,
      widgetType,
      widgetSource,
      widgetSourceVersion,
      framework,
      user_id: userId,
      flow_id,
      organization_id: organizationId,
      activeStatus : "Not Published",
      designTemplate,
      themeConfiguration: themeConfiguration,
      chatId: chatSessionId,
    });

    // Save the widget configuration to the database
    await newWidgetConfiguration.save();

    // Log success event
    await createSuccessLog({
      userId,
      service: logService,
      type: logType,
      projectId,
    });

    // Return success response
    return res.status(201).json({ message: "Widget configuration saved successfully", success: true, statusCode: 201 });
  } catch (error) {
    if (error instanceof Error) {
      // Log the error event
      await createErrorLog({
        userId,
        projectId,
        service: logService,
        type: logType,
        message: error.message,
      });

      console.error("Error saving widget configuration:", error);

      // Return appropriate error response
      if (error.message === "Invalid input") {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    // Handle unexpected errors that aren't instances of Error
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const removeWidgetConfiguration = async (req: Request, res: Response): Promise<Response> => {
  const logService = "WIDGET";
  const logType = "delete_widget_configuration";

  const { organizationId, projectId, userId, widgetId } = req.params;

  // Check if all required parameters are present
  if (!organizationId || !projectId || !userId || !widgetId) {
    return res.status(400).json({
      error: "Missing required parameters: organizationId, projectId, userId, or widgetId",
    });
  }

  try {
    // Find the widget by its ID
    const widget = await WidgetListModel.findById(widgetId);

    // If the widget is not found, return a 404 error
    if (!widget) {
      return res.status(404).json({
        message: "Widget not found. Cannot delete."
      });
    }

    // Check if the widget's activeStatus is "PUBLISHED"
    if (widget.activeStatus === "Published") {
      return res.status(403).json({
        message: "Widget cannot be deleted as it is currently published."
      });
    }

    // Delete the widget if it's not published
    await WidgetListModel.findByIdAndDelete(widgetId);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting widget configuration:", error);

    if (error instanceof Error) {
      await createErrorLog({
        userId,
        projectId,
        service: logService,
        type: logType,
        message: error.message,
      });

      return res.status(500).json({
        error: error.message === "Invalid input" ? error.message : "Internal server error"
      });
    }

    return res.status(500).json({
      error: "An unexpected error occurred"
    });
  }
};

export const editWidgetConfiguration = async (req: Request, res: Response): Promise<Response> => {
  const logService = "WIDGET";
  const logType = "edit_widget_configuration";

  const { organizationId, projectId, userId, widgetId } = req.params;
  const { 
    widgetName, 
    widgetType,
    widgetSource, 
    widgetSourceVersion, 
    framework, 
    designTemplate =1,
    // activeStatus,
    themeConfiguration= {}
  } = req.body;

  try {
    // Validate required parameters
    if (!organizationId || !projectId || !userId || !widgetId) {
      return res.status(400).json({ error: "Missing required parameters: organizationId, projectId, userId, or widgetId" });
    }

    // Find the current widget to check publishStatus
    const currentWidget = await WidgetListModel.findById(widgetId);
    if (!currentWidget) {
      return res.status(404).json({ error: "Widget not found" });
    }

    // Check if the widget's publishStatus is "Published" and ensure updates are allowed only if the widget is "Not Published" 
    if (currentWidget.activeStatus === "Published") {
      return res.status(403).json({ error: "Widget can only be modified when the publishStatus is 'Not Published'" });
    }

    // Prepare the update payload
    const updationPayload: UpdateQuery<IWidgetList> = {
      widgetName, 
      widgetType, 
      widgetSource, 
      widgetSourceVersion, 
      framework, 
      designTemplate, 
      // activeStatus,
      themeConfiguration: themeConfiguration,
    };

    // Update the widget configuration with validation
    await WidgetListModel.findByIdAndUpdate(
      widgetId,
      updationPayload,
      // { new: true, runValidators: true }
    );

    // if (!updatedWidget) {
    //   return res.status(404).json({ error: "Widget not found" });
    // }

    // Log success event
    await createSuccessLog({
      userId,
      service: logService,
      type: logType,
      projectId,
    });

    // Return success response
    return res.status(200).json({ message: "Widget configuration updated successfully", success: true, statusCode: 200 });
  } catch (error) {
    if (error instanceof Error) {
      // Log the error event
      await createErrorLog({
        userId,
        projectId,
        service: logService,
        type: logType,
        message: error.message,
      });

      console.error("Error editing widget configuration:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const publishWidgetById = async (req: Request, res: Response) => {
  const logService = "WIDGET";
  const logType = "publish_widget";
  
  const { organizationId, projectId, userId, widgetId } = req.params;

  // Check if all required parameters are present
  if (!organizationId || organizationId == undefined || !projectId ||  projectId == undefined || !userId || userId == undefined || !widgetId || widgetId == undefined) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try{

    let widgetConfigInfo = await WidgetListModel.findOne({_id: widgetId });
    // console.log(widgetConfigInfo);

    if ( !widgetConfigInfo) {
      return res.status(404).json({
        message: "Widget not found"
      });
    }



    let status = "";

    if (widgetConfigInfo.activeStatus == "Published") {
      status = "Not Published";
    }

    if (widgetConfigInfo.activeStatus == "Not Published") {
      status = "Published";

      const checkPublishedWidgets = await WidgetListModel.findOne({
        user_id: userId,
        projectId: projectId,
        activeStatus: "Published",
        widgetType: widgetConfigInfo.widgetType
      });
      // console.log(checkPublishedWidgets);
  
      if(checkPublishedWidgets) {
        return res.status(402).json({ message: "Widget already published." });
      }

      const checkWidgetExist = await WidgetModel.findOne({
        user_id: userId,
        project_id: projectId,
        widget_type: widgetConfigInfo.widgetType
      });
      // console.log(checkWidgetExist);

      if ( !checkWidgetExist) {
        await WidgetModel.create({
          user_id: userId,
          project_id: projectId,
          widget_configuration_id: widgetId,
          widget_type: widgetConfigInfo.widgetType,
          organization_id: organizationId, 
        });
      } 
      else {
        await WidgetModel.updateOne(
          {
            user_id: userId,
            project_id: projectId,
            widget_type: widgetConfigInfo.widgetType
          },
          {
            widget_configuration_id: widgetId,
          }
        );
      }

    }


    await WidgetListModel.updateOne(
      {
        _id: widgetId,
      },
      {
        activeStatus: status,
      }
    );
    

    return res. status(200).json({ message: "Widget is published successfully"});

  }catch(error: any) {
    console.error("Error deleting widget configuration:", error);
      await createErrorLog({
        userId,
        projectId,
        service: logService,
        type: logType,
        message: error.message,
      });

    if(error.message == "Invalid input"){
      return res.status(400).json({error: error.message});
    }

    if (error.message == "Widget not found") {
      return res.status(404).json({error: error.message});
    }

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

export const getWidgetConfiguration = async (req: Request, res: Response) => {
  const logService = "WIDGET";
  const logType = "get_widget_configuration";

  const { organizationId, projectId, userId, widgetId } = req.params;
  const { limit = 10, skip = 0 } = req.query;

  try {
    // Validate required parameters
    if (!organizationId || !projectId || !userId) {
      return res.status(400).json({ error: "Missing required parameters: organizationId, projectId, or userId" });
    }

    let widgetData;

    if (widgetId) {
      // Fetch a single widget if widgetId is present
      widgetData = await WidgetListModel.findOne({
        organization_id: organizationId,
        user_id: userId,
        _id: widgetId,
      });
      let pipeline: any = [
        {
          $match: {
            organization_id: organizationId,
            user_id: userId,
            _id: new Types.ObjectId(widgetId),
            projectId: new Types.ObjectId(projectId),
          }
        },
        {
          $lookup: {
            from: "widgets",
            localField: "_id",
            foreignField: "widget_configuration_id",
            pipeline: [
              {
                $project: {
                  _id: 1,
                }
              }
            ],
            as: "widget"
          }
        },
        {
          $unwind: {
            path: "$widget",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            widgetId: "$widget._id"
          }
        },
      ];
      // console.log(JSON.stringify(pipeline));
      const dbResponse = await WidgetListModel.aggregate(pipeline);
      if ( dbResponse.length > 0) {
        widgetData = dbResponse[0];
      }

    } else {
      let pipeline: any = [
        {
          $match: {
            organization_id: organizationId,
            user_id: userId,
            projectId: new Types.ObjectId(projectId),
            ...(widgetId && { _id: widgetId })
          }
        },
        {
          $lookup: {
            from: "tenant",
            localField: "user_id",
            foreignField: "clerk_id",
            as: "userInfo"
          }
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            widgetName: 1,
            widgetType: 1,
            widgetSource: 1,
            widgetSourceVersion: 1,
            framework: 1,
            activeStatus: 1,
            organization_id: 1,
            user: "$userInfo.username",
            createdAt: 1,
            updatedAt: 1
          },
        },
        { $sort: { updatedAt: -1 } },
        {
          $facet: {
            data: [
              { $skip: Number(skip) },
              { $limit: Number(limit) },
            ],
            count: [
              { $count: "totalCount" }
            ],
          }
        }
      ];
      // console.log(JSON.stringify(pipeline));
      widgetData = await WidgetListModel.aggregate(pipeline)
    }

    // if (!widgetData || widgetData.length === 0) {
    //   return res.status(404).json({ error: "No widget configuration found" });
    // }

    // Return the found widget data
    // return res.status(200).json({ data: widgetData || {} });
    return res.status(200).json({
      data: widgetId ? widgetData : widgetData[0]?.data || [],
      totalCount: widgetId ? 1 : widgetData[0]?.count[0]?.totalCount || 0,
    });

  } catch (error) {
    if (error instanceof Error) {
      // Log the error event
      await createErrorLog({
        userId,
        projectId,
        service: logService,
        type: logType,
        message: error.message,
      });

      console.error("Error fetching widget configuration:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Handle unexpected errors
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const generatePromptWidget = async (req : Request, res : Response) => {
  const { organizationId, projectId, userId } = req.params;
  const { userPrompt } = req.body;
  try {
    // validation
    if (!organizationId || !projectId || !userId) {
      return res.status(400).json({ error: "Missing required parameters: organizationId, projectId, or userId" });
    }

    if(!userPrompt) return res.status(404).json({ error: "User Prompt is not found!" });

    const generatedResponse = {
      response: `This is a mock response based on your prompt: '${userPrompt}'`,
      references: [
        "Mock reference 1",
        "Mock reference 2",
        "Mock reference 3",
        "Mock reference 4"
      ],
    };

     return res.status(200).json({data : generatedResponse, message: "Successfully fetched messages!", statusCode: 200});

  } catch (error) {
    console.error("Error generating response: ", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
}

export const generateAPIKey = async (req: Request, res: Response) => {
  const { organizationId, projectId, userId } = req.params;

  try {
    // Find the tenant first
    const tenant = await TenantModel.findOne({ clerk_id: userId });

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
        statusCode: 404,
      });
    }

    // Check if the tenant already has an API key
    const existingApiKey = tenant.api_key;

    // Generate a new API key -- add projectId
    const apiKey = generateAPIKeyByEncryption(userId, organizationId, projectId);

    // Update the tenant with the new API key
    tenant.api_key = apiKey;
    await tenant.save();

    const responseMessage = existingApiKey
      ? "API key regenerated successfully"
      : "New API key generated successfully";

    return res.status(200).json({
      data: { apiKey },
      message: responseMessage,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      statusCode: 500,
    });
  }
};

export const validateGeneratedAPIKey = async (req: Request, res: Response) => {
  const { userId, widgetId } = req.params;
  const { apiKey } = req.query;

  try {
     const widgetObjectId = new Types.ObjectId(widgetId);

    const publishedWidget = await WidgetListModel.findById(widgetObjectId);

    if(publishedWidget?.activeStatus === "Not Published"){ 
      return res.status(401).json({ status : false, message: "The widget is not published", statusCode: 401 });
    }

    const tenant = await TenantModel.findOne({ clerk_id: userId });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (tenant.api_key === apiKey) {
      res.status(200).json({ status : true, message: "API Key is valid", statusCode: 200 });
    } else {
      res.status(401).json({ status : false, message: "Invalid API Key", statusCode: 401 });
    }
  } catch (error) {
    console.error("Error validating API key:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getApiKey = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const tenetInstance = await TenantModel.findOne(
      { clerk_id: userId },
    );

    if (!tenetInstance) return res.status(404).json({ message: "Tenant not found", statusCode : 404 });

    const {api_key} = tenetInstance

    if(!api_key) return res.status(404).json({ message: "API Key not present.", statusCode : 404 });

    res.status(200).json({ data : { api_key }, message: "Successfully fetched api key", statusCode: 200 });
  } catch (error) {
    res.status(500).json({ data : null, message: "Internal server error!", statusCode: 500 });
  }
}

export const getWidgetShopName = async ( req: Request, res: Response ) => {
  const { userId, type } = req.params;

  try {
    if( !userId ) {
      return res.status(400).json({ error: "Invalid input"});
    }

    const dbResponse =  await ShopifyCredentialsModel.find({
      userId: userId,
      modelType: type
    })

    return res.status(200).json({ data: dbResponse});

  }catch (error: any) {
    console.log( error.message);
    res.status(500).json({ data : null, message: "Internal server error!", statusCode: 500 });
  }
}