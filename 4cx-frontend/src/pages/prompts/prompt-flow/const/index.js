export const initialPromptProjectData = {
  userId: "",
  projectId: "",
  organizationId: "",
  title: "",
  category: "",
  isOrganization: false,
  text: `<p style="color:red">{query} </p> <br/> <p>{chatHistory}</p> <br/> <p>{search} </p>`,
};

export const initialPromptOrganisationData = {
  userId: "",
  projectId: "",
  organizationId: "",
  title: "",
  category: "",
  isOrganization: true,
  text: `<p style="color:red">{query} </p> <br/> <p>{chatHistory}</p> <br/> <p>{search} </p>`,
};

export const initialPromptProjectDataAi = {
  promptName: "",
  promptCategory: "",
  introPrompt: "",
  businessLogicType: "prompt",
  closurePrompt: "",
  isOrganization: false,
  promptText: "",
  flowiseId:""
};

export const initialPromptOrganisationDataAi = {
  promptName: "",
  promptCategory: "",
  introPrompt: "",
  businessLogicType: "",
  closurePrompt: "",
  isOrganization: true,
  promptText: "",
  flowiseId: ""
};