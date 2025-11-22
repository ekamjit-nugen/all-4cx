import { v4 as uuidv4 } from 'uuid';

export const getChatSessionId = async ()=> {
    try {
        let chatId = uuidv4();
        console.log("Chat ID generated:", chatId);
        return chatId;
    }
    catch(error) {
        console.error("Error in getChatSessionId:", error);
        throw new Error("Failed to get chat session ID");
    }
} 