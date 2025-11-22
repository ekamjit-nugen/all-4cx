import fs from "fs";
import EnvManager from "../core/EnvManager";
import { BlobServiceClient } from "@azure/storage-blob";

const accountName = EnvManager.getAzureAccountName();
const accountKey = EnvManager.getAzureAccountKey();
const containerName = EnvManager.getAzureContainerName();
const connectionString = EnvManager.getAzureConnectionString();
const blobServiceClient =
	BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadFileToAzure = async (
	filePath: string,
	originalPath: string
) => {
	try {
		const allMetadata: any = {
			is_deleted: "false",
			update_count: "1",
		};
		const fileContent = fs.readFileSync(filePath);
		const blobName = originalPath;
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);
		const data = await blockBlobClient.upload(
			fileContent,
			fileContent.length,
			{
				metadata: allMetadata
			}
		);
		const expiryTime = new Date();
		expiryTime.setHours(expiryTime.getHours() + 1);
		fs.unlinkSync(filePath);
		return blockBlobClient.url;
	} catch (error) {
		console.log(error);
		throw new Error();
	}
};

export const updateAzureMetaData = async (metaData: any, blobName: string) => {
	try {
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);
		await blockBlobClient.setMetadata(metaData);
	} catch (error) {
		console.error("Error updating blob metadata:", error);
		throw new Error ("Error updating blob metadata");
	}
};

export const getAzureMetaData = async (blobName: string) => {
	try {
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const properties = await blockBlobClient.getProperties();
        const metadata = properties.metadata;
		return metadata;
	} catch (error) {
		console.error("Error updating blob metadata:", error);
		throw new Error ("Error updating blob metadata");
	}
}
