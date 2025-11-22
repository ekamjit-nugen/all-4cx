import { Router } from "express";
import {
	editWidgetConfiguration,
	generatePromptWidget,
	getApiKey,
	generateAPIKey,
	getWidgetConfiguration,
	removeWidgetConfiguration,
	saveWidgetConfiguration,
	validateGeneratedAPIKey,
	validateCredentials,
	getShopifyCredentialsData,
    getDefaultThemeConfig,
    resetThemeCssConfig,
	publishWidgetById,
	getWidgetShopName,
} from "./widget.controller";

const widgetRoutes = Router();

widgetRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId")
	.get(getWidgetConfiguration);

widgetRoutes.route("/organizations/:organizationId/users/:userId/key")
	.get(getApiKey);

widgetRoutes.route("/organizations/:organizationId/projectId/:projectId/users/:userId/generate-key")
	.get(generateAPIKey);

widgetRoutes.route("/users/:userId/widgetId/:widgetId/validate-key")
	.get(validateGeneratedAPIKey);

widgetRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/widgets/:widgetId")
	.get(getWidgetConfiguration)
	.put(editWidgetConfiguration)
	.delete(removeWidgetConfiguration)
	.patch(publishWidgetById);

widgetRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/save")
	.post(saveWidgetConfiguration);

widgetRoutes.route("/organizations/:organizationId/projects/:projectId/users/:userId/widgets/:widgetId/prompt")
	.post(generatePromptWidget);

widgetRoutes.route("/validate/credentials").post(validateCredentials);

widgetRoutes.route("/credentials")
    .post(getShopifyCredentialsData);

widgetRoutes.route("/cssConfig")
    .get(getDefaultThemeConfig)
    .patch(resetThemeCssConfig)

widgetRoutes.route("/:type/users/:userId/shopNames")
	.get(getWidgetShopName)

export default widgetRoutes;
