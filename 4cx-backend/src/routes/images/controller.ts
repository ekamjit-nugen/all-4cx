import { Request, Response } from "express";
import { createErrorLog, createSuccessLog, GetThreadAndImageFromUrl } from "../../utils/commonhelper";
import { GetImageFromStore } from "../../utils/openAi/chat-image-service";
import { AuthenticatedRequest } from "../../middleware/auth";

export const ImageAPIEntry = async (req: AuthenticatedRequest, res: Response) => {
    const logService = "CHAT_OPEN_AI";
    const logType = "get_image";
    // let { clerk_id } = req.userInfo;
    
    try {
        const { t, img } = req.query;
        const imageData: any = await GetImageFromStore(t, img as string);

        if (imageData.status !== "OK") {
            // return res.status(400).json({ error: "Error while getting image from Azure" });
            throw new Error("Error while getting image from Azure");
        }

        if (imageData.response && typeof imageData.response.pipe === 'function') {
            imageData.response.pipe(res);
            await createSuccessLog({
                // userId: clerk_id,
                service: logService,
                type: logType,
            });

            imageData.response.on('error', (err: Error) => {
                console.error('Error reading stream:', err);
                // return res.status(500).json({ error: 'Error reading image stream' });
                throw new Error("Error reading image stream");
            });
        } else {
            // return res.status(500).json({ error: 'Invalid image stream' });
            throw new Error("Invalid image stream");
        }
    } catch (error: any) {
        console.error(error);
        await createErrorLog({
            // userId: clerk_id,
            service: logService,
            type: logType,
            message: `${error.message}`,
        });
        if(error.message == "Error while getting image from Azure"){
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};
