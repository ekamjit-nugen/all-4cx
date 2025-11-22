import { Router } from "express";

import uploadRoutes from "./upload";
import dataRoutes from "./data";
import userRoutes from "./tenant";
import projectRoutes from "./project";
import searchRoutes from "./search";
import promptRoutes from "./prompt";
import chatRoutes from "./azureChat";
import orchestrateRoutes from "./orchestrate"
import promptTemplateRoutes from "./promptTemplate";
import openAIChatRoutes from "./openAiChat";
import imagesRoutes from "./images";
import notificationRoutes from "./notification";
import credentialRoutes from "./credential";
import widgetRoutes from "./widget/widget.routes";
import phoneNumberRoutes from "./phoneNumber/phoneNumber.routes"
import aiVoiceRouter from "./aiVoicePrompt";
import shopifyRoutes from "./shopify";
import wordPressRoutes from "./wordpress";
import outboundNumberRoutes from "./outboundNumber";

const api: any = Router();

// api.use("/chat", chatRoutes); //azure_chat
api.use("/aiVoice", aiVoiceRouter);
api.use("/openAIchat", openAIChatRoutes);
api.use("/data-sources", dataRoutes);
api.use("/project", projectRoutes);
api.use("/prompt", promptRoutes);
api.use("/search", searchRoutes);
api.use("/tenant", userRoutes);
api.use("/orchestrate", orchestrateRoutes);
api.use("/upload", uploadRoutes);
api.use("/prompt_template", promptTemplateRoutes)
api.use("/images", imagesRoutes)
api.use("/notification", notificationRoutes)
api.use("/credential", credentialRoutes)
api.use("/widget", widgetRoutes)
api.use("/phone-number", phoneNumberRoutes)
api.use("/shopify", shopifyRoutes)
api.use("/wordpress", wordPressRoutes)
api.use("/outbound", outboundNumberRoutes)

export default api;
