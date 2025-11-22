import { Request, Response } from "express";
import { Types } from "mongoose";
import { DataModel, SearchModel } from "../../core/data/models";
import { CreateChatMessage, createErrorLog, createNotificationLog, createSuccessLog } from "../../utils/commonhelper";
import { AuthenticatedRequest } from "../../middleware/auth";

// export const createNewSearchIndex = async (req: AuthenticatedRequest, res: Response) => {
//   const logService = "INDEXES";
//   const logType = "create_indexes";
//   const  { clerk_id } = req.userInfo;
 
//   const { organizationId, projectId } = req.params;
//   const { title, jsonData, retrievalJsonData } = req.body;

//   try{
//       if( !organizationId || !projectId || !title){
//         throw new Error("Invalid input");
//       }

//       let checkDataExist = await SearchModel.findOne({
//         user_id: clerk_id,
//         organization_id: organizationId,
//         project_id: projectId,
//         title: title,
//       });

//       if(checkDataExist) {
//         throw new Error("Search index title already exist");
//       }

//       await SearchModel.create({
//         user_id: clerk_id,
//         organization_id: organizationId,
//         project_id: projectId,
//         data_source_name: title,
//         jsonData: jsonData,
//         retrievalJsonData: retrievalJsonData,
//       });

//       res.status(200).json({ message: "Search index created successfully."});
//       createSuccessLog({
//         userId: clerk_id, 
//         organizationId,
//         projectId,
//         service: logService,
//         type: logType,
//       })
//   }
//   catch(error: any) {
//     createErrorLog({
//       userId: clerk_id,
//       organizationId,
//       projectId,
//       service: logService,
//       type: logType,
//       message: error.message,
//     })
//     if(error.message == "Invalid input") {
//       return res.status(400).json({ error: error.message});
//     }
//     if(error.message == "Search index title already exist") {
//       return res.status(403).json({ error: error.message});
//     }
//     return res.status(500).json({ error: "Internal server error"});
//   }
// };

export const getSearchIndexList = async (req: AuthenticatedRequest, res: Response) => {
  const logService = "INDEXES";
  const logType = "list_indexes";

  const { clerk_id } = req.userInfo;  
  const { organizationId, projectId, title } = req.params;
  const { limit= 10, skip= 0 } = req.query;
  try{
    let pipeline:any = [];

      pipeline.push({
        $match: {
          // user_id: clerk_id,
          organization_id: organizationId,
          project_id: new Types.ObjectId(projectId),
          is_active: true,
          is_deleted: false
        }
      });

      pipeline.push({
        $lookup: {
          from: "tenant",
          localField: "user_id",
          foreignField: "clerk_id",
          as: "userInfo"
        }
      });

      pipeline.push({
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: false
        }
      });

      pipeline.push({
        $addFields: {
          author: "$userInfo.username"
        },
      });

      pipeline.push({
        $sort: {
          updatedAt: -1
        }
      });

      pipeline.push({
        $facet: {
					total: [{ $count: "count" }],
					data: [
						{ $skip: +skip},
						{ $limit: +limit},
					],
				},
      })

    let dataInfo = await SearchModel.aggregate(pipeline);
    return res.status(200).json({
			data: dataInfo[0].data || [],
      dataCount: dataInfo[0]?.total[0]?.count || 0,
    });
  }
  catch(error){
    return res.status(500).json({error: "Internal server error"});
  }
}

export const getSearchSourceData = async ( req: AuthenticatedRequest, res: Response ) => {
  const logService = "SEARCH";
  const logType = "get_use_source_data";

  // let { clerk_id } = req.userInfo;  

  let { userId, projectId, document, strictness, References  }: any = req.body;
  try{
        if( !userId || !projectId ){
          throw new Error("Invalid input");
        }
        let pipeline: any = [];
        pipeline =[
            {
              $match: {
                $or: [
                  {
                    source_type: {
                      $eq: "website"
                    }
                  },
                  {
                    source_type: {
                      $eq: "local"
                    }
                  }
                ]
              }
            },
            {
              $match: {
                clerk_id: userId,
                project_id: new Types.ObjectId(projectId),
                is_deleted: false
              }
            },
            {
              $lookup: {
                from: "root_data_folders",
                localField: "root_folder_id",
                foreignField: "_id",
                as: "folder_info"
              }
            },
            {
              $unwind: {
                path: "$folder_info",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: 1,
                data_type: 1,
                fileName: "$file_name",
                folderName: "$folder_info.file_name",
                is_active: 1,
                is_deleted: 1,
                root_folder_id: "$folder_info._id",
                updatedAt: 1,
                url: 1,
              }
            },
            {
              $addFields: {
                root_file_name: {
                  $cond: {
                    if: {
                      $eq: ["$data_type", "folder"]
                    },
                    then: "$folderName",
                    else: "$fileName"
                  }
                },
                root_file_id: {
                  $cond: {
                    if: {
                      $eq: ["$data_type", "folder"]
                    },
                    then: "$root_folder_id",
                    else: "$_id"
                  }
                }
              }
            },
            {
              $group: {
                _id: "$root_file_id",
                file_name: {
                  $first: "$root_file_name"
                },
                data_type: {
                  $first: "$data_type"
                },
                is_deleted: {
                  $first: "$is_deleted"
                },
                updatedAt: {
                    $first: "$updatedAt"
                },
                url: {
                  $first: "$url"
                }
              }
            },
            {
              $addFields: {
                url: {
                $cond: {
                    if: {
                      $eq: ["$data_type", "folder"]
                    },
                    then: {
                      $arrayElemAt: [
                        { $split: ["$url", "$file_name"] }, 
                        0
                      ]
                    },
                    else: "$url"
                  }
                }
              }	
            },
            {
              $addFields: {
                url: {
                  $cond: {
                    if: {
                      $eq: ["$data_type", "folder"]
                    },
                    then: {
                      $concat: [
                        "$url", "$file_name"
                      ]
                    },
                    else: "$url"
                  }
                }
              }
            },
            {
                $match: {
                    _id: {
                        $ne: null
                    }
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ];
        // console.log(JSON.stringify(pipeline));
        let sourceData = await DataModel.aggregate(pipeline);
        res.status(200).json({data: sourceData || []});
        await createSuccessLog({
          userId, 
          projectId,
          service: logService,
          type: logType,
        });
    }
    catch(error: any){
      await createErrorLog({
        userId: userId, 
        projectId,
        service: logService,
        type: logType,
        message: `${error.message}`,
      });
      if(error.message == "Invalid input"){
        return res.status(400).json({error: error.message});
      }
      console.log("error", error);
      return res.status(500).json({ error: "Internal server error"});
    }
};

export const saveSearchProgress = async ( req: Request, res: Response ) => {
  const logService = "INDEXES";
  const logType = "save_data_source";
  const event = "notification";

  const { organizationId, projectId, userId } = req.params;
  try{
    let { jsonData, name} = req.body;

    if( !organizationId || !projectId || !userId || !name) {
      throw new Error("Invalid input");
    }
    if(!jsonData) {
      throw new Error("Parameter JsonData is required");
    }

    let checkProgressExist:any = await SearchModel.findOne({
      data_source_name: name,
      project_id: projectId,
      user_id: userId,
    });

    createNotificationLog({
			event: event,
			userId: userId,
			organizationId: organizationId,
			title: logType,
			projectId: projectId,
			service: logService,
			status: "Progress"
		});

    if(!checkProgressExist){
      if( !name) {
        throw new Error("Invalid input name");
      }
      let dataInfo =  await SearchModel.create({
        organization_id: organizationId,
        project_id: projectId,
        user_id: userId,
        data_source_name: name,
        jsonData: jsonData,
      });

      createNotificationLog({
        event: event,
        userId: userId,
        organizationId: organizationId,
        title: logType,
        projectId: projectId,
        service: logService,
        status: "Completed"
      });

      await createSuccessLog({
        userId: userId, 
        projectId,
        service: logService,
        type: logType,
      });
      return res.status(200).json({ message: "Search data saved successfully", data: dataInfo});
    }

    let searchId = checkProgressExist._id;

    await SearchModel.findByIdAndUpdate(
      {
        _id: searchId,
      },
      {
        organization_id: organizationId,
        project_id: projectId,
        user_id: userId,
        name,
        jsonData, //Ready to Index
      }
    );
    let data = await SearchModel.findOne({_id: searchId});
    res.status(200).json({ message: "Data updated successfully", data: data});

    createNotificationLog({
      event: event,
      userId: userId,
      organizationId: organizationId,
      title: logType,
      projectId: projectId,
      service: logService,
      status: "Completed"
    });
    await createSuccessLog({
      userId: userId, 
      projectId,
      service: logService,
      type: logType,
    });
  }
  catch(error: any){
    createNotificationLog({
      event: event,
      userId: userId,
      organizationId: organizationId,
      title: logType,
      projectId: projectId,
      service: logService,
      status: "Failed"
    });

    await createErrorLog({
      userId: userId, 
      projectId,
      service: logService,
      type: logType,
      message: `${error.message}`,
    });

    if(error.message == "Invalid input") {
      return res.status(400).json({ error: error.message});
    }
    if(error.message == "Parameter JsonData is required") {
      return res.status(400).json({ error: error.message});
    }
    if(error.message == "Invalid input name") {
      return res.status(400).json({error: error.message});
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error"});
  }
};

export const updateSearchProgress = async ( req:Request, res: Response) => {
  const logService = "INDEXES";
  const logType = "update_search_source";

  const { organizationId, projectId, userId } = req.params;
  try{
    let {status, indexId} = req.body;

    if(!status || !indexId) {
      throw new Error("Invalid input");
    }
    
    let searchInfo = await SearchModel.findOne({
      _id: indexId,
      organization_id: organizationId,
      project_id: projectId,
      user_id: userId,
    });

    if( !searchInfo){
      throw new Error("Data not found");
    }

    await SearchModel.updateOne(
      {
        _id: indexId,
      },
      {
        status: status,
      }
    );

    await createSuccessLog({
      userId: userId,
      service: logService,
      type: logType,
    });
    return res.status(200).json({ message: "Data updated successfully"});
  }
  catch(error: any){
    await createErrorLog({
      userId: userId,
      service: logService,
      type: logType,
      message: `${error.message}`,
    });
    if( error.message = "Invalid input"){
      return res.status(400).json({ error: error.message});
    }
    if( error.message = "Search data not found"){
      return res.status(404).json({ error: error.message});
    }
    return res.status(500).json({error: "Internal server error"});
  }
} 

export const getSearchProgress = async (req: Request, res: Response) => {
  const logService = "INDEXES";
  const logType = "get_search_progress";

  const { organizationId, projectId, userId } = req.params;
  const { indexId }= req.query as { indexId: string };

  try{

    if( !organizationId || !projectId || !userId) {
      throw new Error("Invalid input");
    }
    // let data = await SearchModel.findOne({
    //   organization_id: organizationId,
    //   project_id: projectId,
    //   user_id: userId,
    //   is_active: true,
    //   is_deleted: false
    // });

    let pipeline:any = [];

    if(!indexId) {
      pipeline.push({
          $match: {
            organization_id: organizationId,
            project_id: new Types.ObjectId(projectId),
            user_id: userId,
            is_active: true,
            is_deleted: false
          }
        }
      );
    } else {

      pipeline.push({
        $match: {
          _id: new Types.ObjectId(indexId),
          is_active: true,
          is_deleted: false
        }
      });
    }

      pipeline.push({
        $lookup: {
          from: "tenant",
          localField: "user_id",
          foreignField: "clerk_id",
          as: "userInfo"
        }
      });

      pipeline.push({
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: false
        }
      });

      pipeline.push({
        $addFields: {
          author: "$userInfo.username"
        },
      });

      pipeline.push({
        $sort: {
          updatedAt: -1
        }
      });

    let data = await SearchModel.aggregate(pipeline);
    data = data.length ? data[0] : {}
    res.status(200).json({ data: data});

    await createSuccessLog({
      userId: userId,
      service: logService,
      type: logType,
    });
  }
  catch(error: any){
    await createErrorLog({
      userId: userId,
      service: logService,
      type: logType,
      message: `${error.message}`,
    });
    if( error.message == "Invalid input"){
      return res.status(400).json({ error: error.message});
    }
    console.log(error);
    return res.status(500).json({error: "Internal server error"});
  }
};

export const storeRetrievalJsonData = async (req: Request, res: Response) => {
  const logService = "INDEXES";
  const logType = "save_retrieval_json";

  const { organizationId, projectId, userId } = req.params;
  try{
    if (!organizationId || !projectId || !userId) {
      throw new Error("Invalid input");
    } 
    let { jsonData, indexId } = req.body;

    if( !jsonData || !indexId ){
      throw new Error("Invalid input");
    }

    let checkProgressExist = await SearchModel.findOne({
      _id: indexId,
      project_id: projectId,
      user_id: userId,
    });

    if( !checkProgressExist){
      throw new Error("Data not found");
    }

    let searchId = checkProgressExist._id;

    await SearchModel.findByIdAndUpdate(
      {
        _id: searchId,
      },
      {
        retrievalJsonData: jsonData,
      }
    );
    res.status(200).json({ message: "Updated the search data"});

    await createSuccessLog({
      userId: userId,
      service: logService,
      type: logType,
    })
  }
  catch(error: any){
    await createErrorLog({
      userId: userId,
      service: logService,
      type: logType,
      message: error.message
    });
    if( error.message == "Invalid input") {
      return res.status(400).json({ error: error.message});
    }
    if( error.message == "Data not found") {
      return res.status(404).json({ error: error.message});
    }
    console.log(error);
    return res.status(500).json({error: "Internal server error"});
  }
}

// export const searchPayload = async (req: Request, res: Response) => {
//   const logService = "SEARCH";
//   const logType = "get_search_json";
//   const { organizationId, projectId, userId } = req.params;
//   const { indexId } = req.query;
//   try{
//     if (!organizationId || !projectId || !userId || !indexId) {
//       throw new Error("Invalid input");
//     } 
//     let searchData  = await SearchModel.findOne(
//       {
//         _id: indexId,
//       }
//     );
//     res.status(200).json({ data: searchData || {}});
//     await createSuccessLog({
//       userId: userId,
//       service: logService,
//       type: logType,
//     });
//   }
//   catch(error: any){
//     await createErrorLog({
//       userId: userId,
//       service: logService,
//       type: logType,
//       message: error.message,
//     });
//     if( error.message == "Invalid input") {
//       return res.status(400).json({ error: error.message});
//     }
//     console.log(error);
//     return res.status(500).json({error: "Internal server error"});
//   }
// }