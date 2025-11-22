import { LogsModel, RootFolderModel } from "../../core/data/models";
import { kafka } from  "./client";

export const kafkaProducer = async( userId: string , projectId: string, organizationId: string,  sourceType: string, domain_name:string, urls: string[] ) => {
  if (!urls) {
      return console.log("error");
  }
  const producer = kafka.producer();

  await producer.connect();
  console.log("Producer Connected Successfully");

  try {
      if (urls.length > 0) {

        let rootFolderInfo = await RootFolderModel.create({
          file_name: `${domain_name}`,
          project_id: projectId,
        });

        let rootFolderId = rootFolderInfo._id;
        for (let index = 0; index < urls.length; index++) {
            let count = 0;
            const url = urls[index];
            
            let logsData = await LogsModel.create({
              clerk_id: userId,
              project_id: projectId,
              url: url,
              key: "",
              activity: "Web-url scraping",
              status: "PENDING",
            });
            
            let logId = logsData._id;
            const message = {
              userId,
              organizationId,
              projectId,
              sourceType,
              domain_name,
              url,
              logId,
              count: index + 1,
              totalUrl: urls.length,
              rootFolderId,
            };
      
            await producer.send({
              topic: "file_sync",
              messages: [
                {
                  key: "urls",
                  value: JSON.stringify(message),
                },
              ],
            });
          }
      }
  } catch (error: any) {
      console.log(error);
  } finally {
      await producer.disconnect();
  }
}
