export type IShopifyCredentials = {
  flowId: string;
  userId: string;
  apiKey: string;
  widgetId: string;
  type: string;
  accessToken: string;
  shop: string;
  widgetType: string;
  themeConfiguration: JSON; // Stores theme configuration as a flexible JSON object
  defaultThemeConfiguration: JSON;
  isFullScreen: boolean;
  modelType: string;
};
