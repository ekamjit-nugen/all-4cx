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

const api: any = Router();

api.use("/chat", chatRoutes); //azure_chat
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

export default api;
