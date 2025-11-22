// Generating Code snipeet for widget-setting-code

/**
 * Generates a code snippet for embedding a component with custom styling and configuration.
 *
 * @param {string} language - The programming language to use in the snippet (e.g., "react").
 * @param {number} fontSize - The font size for the component, in pixels.
 * @param {string} fontFamily - The font family to be applied to the component.
 * @param {string} themeColor - The theme color for the component's appearance.
 * @param {string} widthDimension - The width of the component, in pixels.
 * @param {string} userId - The user identifier for customization or tracking.
 * @param {string} variant - The variant type of the component (e.g., "basic", "advanced").
 *
 * @returns {string} - The generated code snippet as a string.
 */

export const generateCodeSnippet = (
  language,
  fontSize,
  fontFamily,
  themeColor,
  widthDimension,
  userId,
  apiKey,
  currentActiveWidgetId,
  flow_id,
  variant
) => {
  const snippets = {
    react: `import React from "react";
import { SearchbarComponent } from "fourcx-widget/packages/react";

const App = () => {
  return (
    <SearchbarComponent
      font-size="${fontSize}px"
      font-style="${fontFamily}"
      theme-color="${themeColor}"
      width-dimension="${widthDimension}"
      user-id="${userId}"
      api-key="${apiKey}"
      widget-id="${currentActiveWidgetId}"
      flow-id="${flow_id}"
      variant="${variant ? variant : 1}"
    />
  );
};

export default App;
`,

    angular: `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`<div style="font-size: ${fontSize}px; font-family: ${fontFamily}; color: ${themeColor}; width: ${widthDimension}px;">
    <h1>Angular Integration</h1>
  </div>\`
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const config = {
      "font-size": "${fontSize}px",
      "font-family": "${fontFamily}",
      "theme-color": "${themeColor}",
      "width-dimension": "${widthDimension}px",
      "user-id": "${userId}",
      "widget-id": "${currentActiveWidgetId}"
      variant="${variant ? variant : 1}"
    };
    console.log("Angular Integration Config:", config);
  }
};
`,

    code: `
import Intercom from "@fourcx/messenger-js-sdk";

document.addEventListener("DOMContentLoaded", function () {
  const config = {
    fontSize: "${fontSize}px",
    fontFamily: "${fontFamily}",
    themeColor: "${themeColor}",
    width: "${widthDimension}px",
    userId: "${userId}",
    variant="${variant ? variant : 1}"
  };

  const container = document.createElement("div");
  container.style.fontSize = config.fontSize;
  container.style.fontFamily = config.fontFamily;
  container.style.color = config.themeColor;
  container.style.width = config.width;
  container.innerText = "Vanilla JS Integration";

  document.body.appendChild(container);

  Intercom(config);
});
`,
  };

  return snippets[language] || "Language not supported.";
};
