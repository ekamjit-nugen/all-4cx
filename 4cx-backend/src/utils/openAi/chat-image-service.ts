import { GetBlob, UploadBlob } from "../azure-storage";

const IMAGE_CONTAINER_NAME = "projectx-data";
const IMAGE_API_PATH = process.env.NEXTAUTH_URL + "/api/images";

export const GetBlobPath = (threadId: string, blobName: string): string => {
	return `${threadId}/${blobName}`;
};

export const UploadImageToStore = async (
	threadId: object | any,
	fileName: string,
	imageData: Buffer
) => {
	return await UploadBlob(IMAGE_CONTAINER_NAME,`${threadId}/${fileName}`, imageData);
};

export const GetImageFromStore = async (threadId:  object | any, fileName: string) => {
	const blobPath = GetBlobPath(threadId, fileName);
	let dta = await GetBlob(IMAGE_CONTAINER_NAME, blobPath);
	console.log(dta);
	return dta;
};

export const GetImageUrl = (threadId: object | any, fileName: string): string => {
	// add threadId and fileName as query parameters t and img respectively
	const params = `?t=${threadId}&img=${fileName}`;

	return `${IMAGE_API_PATH}/${params}`;
};

export const GetThreadAndImageFromUrl = (urlString: string) => {
	// Get threadId and img from query parameters t and img
	const url = new URL(urlString);
	const threadId = url.searchParams.get("t");
	const imgName = url.searchParams.get("img");

	// Check if threadId and img are valid
	if (!threadId || !imgName) {
		return {
			status: "ERROR",
			errors: [
				{
					message:
						"Invalid URL, threadId and/or imgName not formatted correctly.",
				},
			],
		};
	}

	return {
		status: "OK",
		response: {
			threadId,
			imgName,
		},
	};
};
