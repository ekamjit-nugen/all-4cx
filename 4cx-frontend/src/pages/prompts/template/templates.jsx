import { useState } from "react";
import PromptTemplateListing from "./prompt-template-listing";
import ViewPromptTemplate from "./view-prompt-template";

function PromptTemplate() {
  const [isViewPromptTemplate, setIsViewPromptTemplate] = useState(false);
  const [selectedData, setSelectedData] = useState();

  const handleViewTemplate = (data) => {
    setIsViewPromptTemplate(!isViewPromptTemplate);
    setSelectedData(data);
  };

  return isViewPromptTemplate ? (
    <ViewPromptTemplate handleViewTemplate={handleViewTemplate} data={selectedData} />
  ) : (
    <PromptTemplateListing
      handleViewTemplate={handleViewTemplate}
    />
  );
}
export default PromptTemplate;
