const axios = require("axios");

class conversationalRetrievalQAChain1 {
    constructor() {
        this.label = "conversationRetrievalQAChain1 File";
        this.name = "conversationalRetrievalQAChain1";
        this.version = 2.0;
        this.type = "Document";
        this.icon = "Azure.svg";
        this.category = "Document Loaders";
        this.description = `Load data from DOCX files`;
        this.baseClasses = [this.type];
        this.inputs = [
            {
                label: "Docx File",
                name: "docxFile",
                type: "file",
                fileType: ".docx",
            },
            {
                label: "Text Splitter",
                name: "textSplitter",
                type: "TextSplitter",
                optional: true,
            },
            {
                "label": "Chat Prompt Template",
                "name": "chatPromptTemplate",
                "type": "ChatPromptTemplate",
                "description": "Override existing prompt with Chat Prompt Template. Human Message must includes {input} variable",
                "optional": true
            },
            {
                label: "Additional Metadata",
                name: "metadata",
                type: "json",
                description:
                    "Additional metadata to be added to the extracted documents",
                optional: true,
                additionalParams: true,
            },
            {
                label: "Omit Metadata Keys",
                name: "omitMetadataKeys",
                type: "string",
                rows: 4,
                description:
                    "Each document loader comes with a default set of metadata keys that are extracted from the document. You can use this field to omit some of the default metadata keys. The value should be a list of keys, separated by commas. Use * to omit all metadata keys except the ones you specify in the Additional Metadata field",
                placeholder: "key1, key2, key3.nestedKey1",
                optional: true,
                additionalParams: true,
            },
        ];
        this.outputs = [
            {
                label: "Document",
                name: "document",
                description:
                    "Array of document objects containing metadata and pageContent",
                baseClasses: [...this.baseClasses, "json"],
            },
            {
                label: "Text",
                name: "text",
                description: "Concatenated string from pageContent of documents",
                baseClasses: ["string", "json"],
            },
        ];
        console.log("AzureAISearch initialized");
    }

    async init(...args) {
        const [nodeData, , options, components] = args;
        console.log(
            "--------INPUTSS-------",
            nodeData.inputs,
            "components",
            components
        );

        const vectorStore = await require(components.conversationalRetrievalQAChain
            .filePath);
        const newNodeInstance = new vectorStore.nodeClass();

        return await newNodeInstance.init(...args);
    }

    async run(...args) {
        console.log("--------INPUTS-------", args);

        const [nodeData, , options, components] = args;
        if ( options.systemMessagePrompt ) {
          let splitParagraph = (paragraph) =>  {
                paragraph = paragraph
                    .replace(/{chatHistory}/g, '{chat_history}')
                    .replace(/{search}/g, '{context}')
                    .replace(/{query}/g, '{question}');
                let lines = paragraph.split("\n"); // Split by lines
                let result = { rephrasePrompt: "", responsePrompt: "" };
                let currentKey = "rephrasePrompt"; // Default to rephrasePrompt before encountering {context}
            
                lines.forEach(line => {
                    if (line.includes("{context}")) {
                        currentKey = "responsePrompt";
                    }
                    result[currentKey] += (result[currentKey] ? "\n" : "") + line; // Preserve line structure properly
                });

                // console.log("result", result);
        
                return result;
            
            }
            const response = splitParagraph(options.systemMessagePrompt)
            nodeData.inputs.responsePrompt = response.responsePrompt
            nodeData.inputs.rephrasePrompt = response.rephrasePrompt

            console.log("responsePrompt", nodeData.inputs.responsePrompt);
            console.log("rephrasePrompt", nodeData.inputs.rephrasePrompt);

        }

        const vectorStore = await require(components.conversationalRetrievalQAChain.filePath);
        const newNodeInstance = new vectorStore.nodeClass();

        return await newNodeInstance.run(...args); // Pass all received arguments dynamically
    }

}

module.exports = { nodeClass: conversationalRetrievalQAChain1 };
