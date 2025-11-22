import axios from "axios";
const containerName = "projectx-data";
const containerPath =
	"https://customerxdata.blob.core.windows.net/projectx-data";

export const createIndexers = async (title, jsonData) => {
	try {
		let indexProgress = await axios.post(
			"https://ragingestionfuncv2.azurewebsites.net/api/setup-ingestion?code=o20gH2rIMNgp1s447kVnSqgNuZ6t5f-k3WJlvKs8zXcgAzFuL6IHVQ==",
			{
				indexName: title,
				containerName: containerName,
				containerPath: containerPath,
				jsonData: jsonData,
			}
		);
		console.log("createIndexes :: ", indexProgress?.data);
		return indexProgress?.data;
	} catch (error: any) {
		console.log(error.message);
		throw new Error("internal error");
	}
};

export const getIndexsList = async () => {
	try {
		let indexesList = await axios.get(
			"https://ragingestionfuncv2.azurewebsites.net/api/get-indexes?code=o20gH2rIMNgp1s447kVnSqgNuZ6t5f-k3WJlvKs8zXcgAzFuL6IHVQ==",
		);
		// console.log("createIndexes :: ", indexesList?.data);
		return indexesList?.data;
	}catch (error: any) {
		console.log(error.message);
		throw new Error("internal error");
	}
}

export const getIndexesStatus = async (indexers) => {
	try {
		let indexProgress = await axios.post(
			"https://ragingestionfuncv2.azurewebsites.net/api/check-indexer-status?code=o20gH2rIMNgp1s447kVnSqgNuZ6t5f-k3WJlvKs8zXcgAzFuL6IHVQ==",
			{
				indexers: indexers,
			}
		);
		// console.log("getIndexesStatus :: ",  indexProgress?.data?.results)
		const updatedResults = indexProgress?.data?.results?.map((result) => { 
			// console.log("result", result
			const lastResult = result.lastResult; 
			if ( !lastResult ) { 
				return { 
					...result, 
					lastResult: { 
						status: "fail", 
						itemsProcessed: 0, 
						itemsFailed: 0
					}
				}
			}  
			const { status, itemsProcessed, itemsFailed } = result.lastResult; 
			if ( status == "inProgress" ) {
				return { 
					...result, 
					lastResult: { 
						...result.lastResult, 
						status: "In Progress"
					}
				}
			}  
 
			if ( status == "Failed") {  
				return { 
					...result, 
 					lastResult: {
 						...result.lastResult,
 						status: "Failed"
 					} 
				}
			}  
 
			if ( itemsProcessed === null && itemsFailed === null ) {
				return { 
					...result, 
					lastResult: { 
						...result.lastResult, 
						status: "Failed", 
					} 
				}
			};
 
			let updatedStatus = "Success"; //default
 
			if ( itemsProcessed == 0 || itemsFailed > itemsProcessed ) {
				updatedStatus = "Failed"; 
			}  
			else if (itemsFailed == 0 && itemsProcessed > 0) {
				updatedStatus = "Success"; 
			}  
			else if (itemsProcessed > itemsFailed && itemsFailed > 0) {
				updatedStatus = "Partial Success"; 
			}   
			let newResult= {
				...result, 
				lastResult: { 
					...result.lastResult, 
					status: updatedStatus, 
				}
			}   
			// console.log("newResult", newResult)
			return newResult;
		})
		return { results: updatedResults }
	} catch (error: any) {
		console.log(error.message);
		throw new Error("internal error");
	}
}
