const axios = require("axios");
class AzureAISearch {
	constructor() {
		this.label = "Docx File";
		this.name = "AzureAISearch";
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
				description:
					"Concatenated string from pageContent of documents",
				baseClasses: ["string", "json"],
			},
		];
		console.log("AzureAISearch initialized");
	}

	async init(nodeData, _, options, components) {
		// console.log("--------INPUTSS-------", nodeData.inputs, components);
		let indexesData = [];
		let customer_indexes_array = [];
		let industry_indexes_array = [];

		// console.log(nodeData?.inputs?.searchIndex[0]);

		customer_indexes_array = nodeData?.inputs?.searchIndex;
		industry_indexes_array =  nodeData?.inputs?.industryIndexes;

		let customer_indexes= [];
		let industry_indexes= [];

		if ( customer_indexes_array.length > 0) {
			customer_indexes = customer_indexes_array.map((e) => {
				return e.name
			})
		}

		if ( industry_indexes_array.length > 0) {
			industry_indexes = industry_indexes_array.map((e) => {
				return e.name
			})
		}

		console.log(customer_indexes, industry_indexes);

		try {
			const result = await axios.post(
				`https://ragingestionfuncv2.azurewebsites.net/api/get_chunks?code=o20gH2rIMNgp1s447kVnSqgNuZ6t5f-k3WJlvKs8zXcgAzFuL6IHVQ==`,
				{
					query: "what's this document about",
					customer_indexes: customer_indexes,
					industry_indexes: industry_indexes
				}
			);
            // console.log("result :::", result);
            indexesData = [...result?.data?.customer_chunks, ...result?.data?.industry_chunks];
            
		} catch (error) {
            console.log(error);
			return error;
		}
        const vectorStore = await require(components.memoryVectorStore
            .filePath);
        const newNodeInstance = new vectorStore.nodeClass();

        nodeData.inputs.document = indexesData;
		// .then(function (response) {
		//     indexesData = response?.data?.chunks;
		//     console.log("done", response?.data);
		// })
		// .catch(function (error) {
		//     console.log(error.message);
		// });


		return await newNodeInstance.init(nodeData);
		// console.log(newNodeInstance, "newNodeInstance");

		// const response  =  appServer.nodesPool.componentNodes
		// console.log(response ,"response")
		// Example Document Output
		// const documentOutput = [
		// 	{
		// 		id: "1e904131-a439-4c70-ba81-1767787bf82e",
		// 		docId: "6553a055-4608-4622-a48b-f2d13f511932",
		// 		storeId: "a62b02a2-5737-46a3-be80-784f7985939a",
		// 		chunkNo: 1,
		// 		pageContent:
		//  		metadata: '{"source":"blob","blobType":""}',
		// 	},
		// ];

		// return documentOutput; // Returning as an array as per output definition
	}
}

module.exports = { nodeClass: AzureAISearch };
