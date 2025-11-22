import EnvManager from "../../core/EnvManager";
import { DataModel, LogsModel } from "../../core/data/models";
import { kafka } from "./client";
import { createNotificationLog, getFileName, scrapUrl } from "../commonhelper";
import { uploadFileToAzure } from "../upload";

const group = EnvManager.getKafkaGroupId();

export const kafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: group });
  if (!group) {
    console.error("Error: Group ID not provided.");
  }
  try {
    console.log(`Connecting Consumer with group ID: ${group}`);
    await consumer.connect();
    console.log("Consumer Connected Successfully");

    await consumer.subscribe({ topic: "file_sync", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
        const messageValue = message.value.toString();
        console.log( `${group}: [${topic}]`, messageValue);
        try {
          const { userId, organizationId, projectId, sourceType, domain_name, url, logId, count, totalUrl, rootFolderId } = JSON.parse(messageValue);
          console.log("Parsed message:", { userId, projectId, sourceType, domain_name, url, totalUrl });

          let filePath: any= await scrapUrl(url, logId, domain_name);
          // let fileName = await generateFileName(filePath);
          // console.log(filePath, fileName);
          let originalName = `${userId}/${projectId}/${sourceType}/${domain_name}/${filePath}.html`;
          let fileUrl = await uploadFileToAzure(filePath, originalName);
          console.log(`${domain_name}/${filePath}`);
          let checkDataExist = await DataModel.findOne(
            {
              file_name: `${domain_name}/${filePath}`,
              clerk_id: userId,
              project_id: projectId,
              is_deleted: false,
            }
          )
          if ( !checkDataExist){
            await DataModel.create({
              file_name: `${domain_name}/${filePath}`,
              clerk_id: userId,
              project_id: projectId,
              url: fileUrl,
              source_type: sourceType,
              data_retention_policy: "",
              encryption_enabled: false,
              data_type: "folder",
              update_count: "1",
              root_folder_id: rootFolderId,
            });
            // console.log("DONE");
          }else {
            let dataId = checkDataExist._id;
            let updatedCount = checkDataExist.update_count;

				    let num = Number(updatedCount);
				    let increment = ++num;
            await DataModel.updateOne(
              {
                _id: dataId
              },
              {
                url: fileUrl,
                data_type: "folder",
                update_count: increment.toString(),
              }
            )
          }
          await LogsModel.updateOne(
              { _id:logId },
              {
                $set: {
                  url: url,
                  key: fileUrl,
                  status: "COMPLETED"
                }
              }
            );
          let logData = await LogsModel.findOne({_id: logId})
          
          global.io.emit("url-scraping", { processed: count, total: totalUrl, data: logData});

          if( totalUrl == count) {
            createNotificationLog({
              event: "notification",
			        userId: userId,
			        organizationId: organizationId,
			        title: "web_source",
			        projectId: projectId,
			        service: "DATA_UPLOAD",
			        status: "Completed"
            })
          }
  
        } catch (error: any) {
					  console.error(`Error processing URL`, error);
          }
      },
    });
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}