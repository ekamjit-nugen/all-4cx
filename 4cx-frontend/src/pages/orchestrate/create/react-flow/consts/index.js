export const initialNodes = [
  {
    id: "inputNode-0",
    type: "inputNode",
    position: { x: 50, y: 100 },
    data: { inputHeading: "Input", inputButtonText: "Add Variable" },
  },
  {
    id: "text-0",
    type: "text",
    targetPosition: "top",
    position: { x: 300, y: 100 },
    data: {
      textHeading: "Text",
      textContent: "Text content",
      textButton: "Add variable",
      textTemplate: "Mustache Template is used here, use variable name to insert a variable.",
    },
  },
  {
    id: "chat-0",
    type: "chat",
    targetPosition: "top",
    position: { x: 550, y: 100 },
    data: {
      firstHeading: "Chat GPT Message",
      secondHeading: "Message Content",
      radioButtons: [
        { radio_id: "radio-1", label: "System" },
        { radio_id: "radio-2", label: "Assistant" },
        { radio_id: "radio-3", label: "User" },
      ],
      radioHeading: "Role",
      buttonText: "Add variable",
      template: "Mustache Template is used here, use variable name to insert a variable.",
    },
  },
  {
    id: "output-0",
    type: "outPut",
    position: { x: 800, y: 100 },
    data: { outPutHeading: "Output", outPutButtonText: "Add Variable" },
  },
  {
    id: "chatHistory-0",
    type: "chatHistory",
    position: { x: 100, y: 250 },
    data: { inputHeading: "Input", inputButtonText: "Add Variable" },
  },
];

export const initialEdges = [];
