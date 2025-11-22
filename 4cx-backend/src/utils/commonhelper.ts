import fs from "fs/promises";
import axios from "axios";
import xlsx from "xlsx";
import path from "path";
import cheerio from "cheerio";
import { Types } from "mongoose";
import { promisify } from "util";
import { setTimeout } from "timers/promises";
import { ChatLogsModel, ChatModel, LogsModel } from "../core/data/models";
import EnvManager from "../core/EnvManager";
import { ChatRole } from "../core/data/IOpenAiChat";
import { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { IOpenAiChatThread } from "../core/data/IOpenAiChatThread";
import { GetDefaultExtensions } from "./openAi/chat-api-default-extensions";
import { UploadBlob } from "./azure-storage";
import { Status } from "../core/data/ILogs";
import { encodingForModel, getEncoding } from "js-tiktoken";
import Search from "../core/data/models/search";

export const compareSecretKey = (secretKey: string | string[]): Boolean => {
	let authKey = EnvManager.getAuthSecretKey();
	if (authKey == secretKey) {
		return true;
	}
	return false;
};

export const createNotificationLog = ({
	event,
	userId,
	organizationId,
	title,
	projectId,
	service,
	status,
}: {
	event: string;
	userId: string;
	organizationId: string;
	title: string;
	projectId: string;
	service: string;
	status: string;
}) => {
	global.io.emit(event, {
		userId,
		organizationId,
		title,
		projectId,
		service,
		status,
		createdAt: new Date(), 
	});
};

export const usageToken = async ({
	input,
	output,
}: {
	input: string;
	output: string;
}) => {
	try {
		const response = await axios.post(
			"https://fourcx-openai.azurewebsites.net/api/CountTokens?code=hhUU8UxWS2nx0z3NYMBabysd_tBRP6GC5at46h_46uqIAzFuNwKgIQ%3D%3D",
			{
				messages: [
					{
						inputs: {
							question: input,
						},
					},
					{
						outputs: {
							answer: output,
						},
					},
				],
				model: "gpt-3.5-turbo-0613",
			}
		);
		let usageToken = response.data;
		return usageToken;
	} catch (error) {
		console.log(error);
	}
};

export const getExtensions = async (props: {
	chatThread: IOpenAiChatThread;
	userMessage: string;
	// signal: AbortSignal;
}) => {
	const extension: Array<any> = [];
	console.log(props.chatThread, props.userMessage);
	const response = await GetDefaultExtensions({
		chatThread: props.chatThread,
		userMessage: props.userMessage,
	});
	if (response.status === "OK" && response.response.length > 0) {
		extension.push(...response.response);
	}

	// const dynamicExtensionsResponse = await GetDynamicExtensions({
	// 	extensionIds: props.chatThread.extension,
	//   });
	//   if (
	// 	dynamicExtensionsResponse.status === "OK" &&
	// 	dynamicExtensionsResponse.response.length > 0
	//   ) {
	// 	extension.push(...dynamicExtensionsResponse.response);
	// }
	// console.log(extension);

	return extension;
};

export const getHistory = async ({
	threadId,
}: {
	threadId: string;
}): Promise<any> => {
	let pipeline: Array<any> = [];
	try {
		pipeline = [
			{
				$match: {
					thread_id: new Types.ObjectId(threadId),
					is_deleted: false,
				},
			},
			{
				$match: {
					$or: [
						{
							role: "user",
						},
						{
							role: "assistant",
						},
					],
				},
			},
			{
				$project: {
					_id: 0,
					role: 1,
					content: 1,
				},
			},
			{
				$sort: {
					createdAt: -1,
				},
			},
		];
		const chatHistory = await ChatModel.aggregate(pipeline);
		return chatHistory;
	} catch (error) {
		console.log("error: ", error);
	}
};

// export const getHistory = async ({ threadId }: { threadId: string }) => {
// 	try {
// 		const chatHistory = await ChatModel.find({
// 				thread_id: threadId,
// 				is_deleted: false,
// 			},
//       {
//         _id: 0,
//         role: 1,
//         content: 1,
//       }
// 		).sort({ createdAt: -1 });

// 		console.log("chatHistory : ", chatHistory);

// 		return chatHistory;
// 	} catch (error) {
// 		console.log("error: ", error);
// 	}
// };

export const countTokens = (
	messages: string | Array<{ [key: string]: string }>,
	model: any = "gpt-4-0613"
): number => {
	let encoding: any;

	try {
		encoding = encodingForModel(model);
	} catch (err) {
		console.warn("Warning: model not found. Using cl100k_base encoding.");
		encoding = getEncoding("cl100k_base");
	}

	let tokensPerMessage = 0;
	let tokensPerName = 0;

	if (
		[
			"gpt-3.5-turbo-0613",
			"gpt-3.5-turbo-16k-0613",
			"gpt-4-0314",
			"gpt-4-32k-0314",
			"gpt-4-0613",
			"gpt-4-32k-0613",
		].includes(model)
	) {
		tokensPerMessage = 3;
		tokensPerName = 1;
	} else if (model === "gpt-3.5-turbo-0301") {
		tokensPerMessage = 4;
		tokensPerName = -1;
	} else if (model.includes("gpt-3.5-turbo")) {
		console.warn(
			"Warning: gpt-3.5-turbo may update over time. Assuming gpt-3.5-turbo-0613."
		);
		return countTokens(messages, "gpt-3.5-turbo-0613");
	} else if (model.includes("gpt-4")) {
		console.warn(
			"Warning: gpt-4 may update over time. Assuming gpt-4-0613."
		);
		return countTokens(messages, "gpt-4-0613");
	} else {
		throw new Error(`countTokens is not implemented for model ${model}.`);
	}

	let numTokens = 0;

	if (Array.isArray(messages)) {
		messages.forEach((message) => {
			numTokens += tokensPerMessage;
			Object.entries(message).forEach(([key, value]) => {
				numTokens += encoding.encode(value).length;
				if (key === "name") {
					numTokens += tokensPerName;
				}
			});
		});
		numTokens += 3; // for priming <|start|>assistant<|message|>
	} else if (typeof messages === "string") {
		numTokens += encoding.encode(messages).length;
	}

	return numTokens;
};

export const CreateChatMessage = async ({
	name,
	userId,
	content,
	role,
	chatThreadId,
	multiModalImage,
}: {
	name: string;
	userId?: string;
	role: ChatRole;
	content: string;
	chatThreadId: Object;
	multiModalImage?: string;
	extensions?: RunnableToolFunction<any>[];
}) => {
	const chatInfo = await ChatModel.create({
		name: name,
		user_id: userId,
		content: content,
		role: role,
		thread_id: chatThreadId,
		multi_modal_image: multiModalImage,
	});
	return chatInfo;
};

export const createSuccessLog = async ({
	userId,
	email,
	organizationId,
	projectId,
	promptId,
	dataSourceId,
	activity,
	service,
	status,
	threadId,
	type,
	message,
	token,
}: {
	userId?: string;
	email?: string;
	organizationId?: string;
	projectId?: string;
	promptId?: Object;
	dataSourceId?: string;
	activity?: string;
	service?: string;
	status?: Status;
	threadId?: Object;
	type: String;
	message?: string;
	token?: number;
}) => {
	const logger = await LogsModel.create({
		user_id: userId,
		email,
		organization_id: organizationId,
		project_id: projectId,
		prompt_id: promptId,
		data_source_id: dataSourceId,
		activity,
		service,
		status: status ? status : "COMPLETED",
		thread_id: threadId,
		data: {
			type: `${type}`,
			response: message ? message : "success",
		},
		token_usage: {
			prompt_tokens: token,
		},
	});
	return logger;
};

export const createErrorLog = async ({
	userId,
	email,
	organizationId,
	projectId,
	promptId,
	dataSourceId,
	activity,
	service,
	status,
	threadId,
	type,
	message,
}: {
	userId?: string;
	email?: string;
	organizationId?: string;
	projectId?: string;
	promptId?: Object;
	dataSourceId?: string;
	activity?: string;
	service?: string;
	status?: string;
	threadId?: Object;
	type: string;
	message: string;
}) => {
	const logger = await LogsModel.create({
		user_id: userId,
		email: email,
		organization_id: organizationId,
		project_id: projectId,
		prompt_id: promptId,
		data_source_id: dataSourceId,
		activity,
		service,
		status: status ? status : "ERROR",
		thread_id: threadId,
		data: {
			type: `ERROR :: ${type}`,
			response: message ? `${message}` : "success",
		},
	});
	return logger;
};

export const updateChatToken = async ({
	userId,
	organizationId,
	projectId,
	promptId,
	threadId,
	token,
	type,
	usageToken,
}: {
	userId?: string;
	organizationId?: string;
	projectId?: Object;
	promptId?: Object;
	threadId?: Object;
	type?: String;
	token?: number;
	usageToken?: object;
}) => {
	const logger = await ChatLogsModel.create({
		user_id: userId,
		organization_id: organizationId,
		project_id: projectId,
		prompt_id: promptId,
		thread_id: threadId,
		prompt_tokens: token,
		type: type,
		usage_token: usageToken,
	});

	return logger;
};

export const getUrlDomainName = (url: string) => {
	let domain = url.replace(/(^\w+:|^)\/\/(www\.)?/, "");
	domain = domain.replace(/\/(.*)/, "");
	return domain;
};

export const readXlsxFile = (filePath: string) => {
	const workbook = xlsx.readFile(filePath);
	const sheetNameList = workbook.SheetNames;
	const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
	return data;
};

const writeFileAsync = promisify(fs.writeFile);
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const scrapUrl = async (
	url: string,
	logId: any,
	domain_name: string
) => {
	let retries = 0;
	while (retries < MAX_RETRIES) {
		try {
			const response = await axios.get(url, { timeout: 8000 });
			const urlObj = new URL(url);
			const hostname = urlObj.hostname;
			const htmlContent = response.data;

			const pathArray = urlObj.pathname
				.split("/")
				.filter((seg) => seg !== "");
			const lastSegment = pathArray.join(" ");

			console.log(`Hostname: ${hostname}`);
			console.log(`Path segments: ${lastSegment}`);

			let filePath = path.basename(url);
			if (!lastSegment) {
				await fs.writeFile(hostname, htmlContent);
				return hostname;
			}
			await fs.writeFile(lastSegment, htmlContent);
			return lastSegment;
		} catch (error: any) {
			retries++;
			console.error(
				`Error fetching URL (attempt ${retries}):`,
				error.message
			);
			if (retries < MAX_RETRIES) {
				await setTimeout(RETRY_DELAY);
			} else {
				await LogsModel.updateOne(
					{ _id: logId },
					{
						$set: {
							url: url,
							key: "",
							status: `Error: ${error.message}`,
						},
					}
				);
				throw new Error(
					`Failed to fetch URL after ${MAX_RETRIES} attempts`
				);
			}
		}
	}
};

export const getScrapWebUrl = async (url: string) => {
	try {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data, { xmlMode: true });

		let urls: string[] = [];
		let sitemaps: string[] = [];

		$("url loc").each((i, elem) => {
			urls.push($(elem).text());
		});

		$("sitemap loc").each((i, elem) => {
			sitemaps.push($(elem).text());
		});
		// console.log(urls.length);
		// fs.writeFileSync(path.join(__dirname, 'urls.json'), JSON.stringify(urls));
		// fs.writeFileSync(path.join(__dirname, 'sitemaps.json'), JSON.stringify(sitemaps));
		return urls;
	} catch (error) {
		console.log(error);
	}
};

export const getUrlCount = async (url: string) => {
	try {
		// console.log(url);
		const response = await axios.get(url);
		if (response.status == 403) {
			return Promise.reject(
				new Error(`Forbidden: can't access this data.`)
			);
		}
		const $ = cheerio.load(response.data, {
			xmlMode: true,
		});

		let urls: string[] = [];
		let sitemaps: string[] = [];
		$("sitemap loc").each((i, elem) => {
			sitemaps.push($(elem).text());
		});
		$("url loc").each((i, elem) => {
			urls.push($(elem).text());
		});

		if (sitemaps.length > 0) {
			for (const sitemapUrl of sitemaps) {
				const response = await axios.get(sitemapUrl);
				const $ = cheerio.load(response.data, {
					xmlMode: true,
				});
				$("url loc").each((i, elem) => {
					urls.push($(elem).text());
				});
			}
		}
		let count = Promise.resolve(urls);
		return Promise.resolve(count);
	} catch (err: any) {
		if (axios.isAxiosError(err)) {
			if (err.response) {
				return Promise.reject(
					new Error(
						`Request failed with status code ${err.response.status}: ${err.response.statusText}`
					)
				);
			} else if (err.request) {
				return Promise.reject(
					new Error(`No response received: ${err.message}`)
				);
			} else {
				return Promise.reject(
					new Error(`Error in request setup: ${err.message}`)
				);
			}
		}
	}
};

export const validateUrlAxios = async (url: string) => {
	try {
		let urls: string[] = [];
		const response = await axios.get(url);
		if (response.status == 403) {
			return Promise.reject(
				new Error("Access forbidden: Received 403 status code")
			);
		}
		let htmlData = response.data;
		urls.push(htmlData);
		return Promise.resolve(urls);
	} catch (err) {
		if (axios.isAxiosError(err)) {
			if (err.response) {
				return Promise.reject(
					new Error(
						`Axios Request failed with status code ${err.response.status}: ${err.response.statusText}`
					)
				);
			} else if (err.request) {
				return Promise.reject(
					new Error(`Axios no response received: ${err.message}`)
				);
			} else {
				return Promise.reject(
					new Error(`Axios error in request setup: ${err.message}`)
				);
			}
		}
	}
};

export const getFileName = async (url: string) => {
	const urlObj = new URL(url);
	const hostname = urlObj.hostname;
	let pathname = urlObj.pathname;
	if (pathname.startsWith("/")) {
		pathname = pathname.substring(1);
	}

	if (pathname) {
		return `${hostname}/${pathname}`;
	}

	return hostname;
};

export const downloadFile = async (url: string, logId: any) => {
	try {
		const response = await axios.get(url, { responseType: "arraybuffer" });

		if (response.status === 403) {
			return Promise.reject("Access forbidden (403).");
		}

		const contentType = response.headers["content-type"];

		if (!contentType.includes("pdf") && !contentType.includes("msword")) {
			console.log("The URL does not point to a PDF or DOC file.");
			return Promise.reject("Access forbidden (403).");
		}
		const fileType = contentType.includes("pdf") ? "pdf" : "doc";
		const fileName = path.basename(url);
		const filePath = path.join(__dirname, fileName);

		await fs.writeFile(filePath, response.data, "binary");

		console.log(`${fileType.toUpperCase()} saved to ${filePath}`);

		return Promise.resolve(filePath);
	} catch (err: any) {
		console.log(err);
		await LogsModel.updateOne(
			{ _id: logId },
			{
				$set: {
					url: url,
					key: "",
					status: `Error downloading file:`,
				},
			}
		);
		return Promise.reject(`Error downloading file:, ${err}`);
	}
};

export const getBlobName = async (url: string) => {
	try {
		let blob = "";
		const decodedName = decodeURIComponent(url);
		let azureBlobPath: any = decodedName.split(
			"https://customerxdata.blob.core.windows.net/projectx-data/"
		);
		blob = azureBlobPath.splice(-1).join();
		return blob;
	} catch (err) {
		console.log(err);
	}
};

export const HistoryContainer = () => {
	return "container";
};

const IMAGE_CONTAINER_NAME = "projectx-data";

export const UploadImageToStore = async (
	threadId: string,
	fileName: string,
	imageData: Buffer
) => {
	return await UploadBlob(
		IMAGE_CONTAINER_NAME,
		`${threadId}/${fileName}`,
		imageData
	);
};

export const uniqueId = () => {
	const alphabet =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const length = 8;
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * alphabet.length);
		result += alphabet[randomIndex];
	}
	return result;
};

export const GetThreadAndImageFromUrl = (urlString: string) => {
	try {
		const url = new URL(`http://localhost:9002/${urlString}`);
		const threadId = url.searchParams.get("t");
		const imgName = url.searchParams.get("img");

		// console.log("threadId:", threadId, "imgName:", imgName);

		// Check if threadId and imgName are valid
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

		// Response object when both threadId and imgName are valid
		const response = {
			status: "OK",
			response: {
				threadId,
				imgName,
			},
		};
		return response;
	} catch (error) {
		console.error("Error parsing URL:", error);

		return {
			status: "ERROR",
			errors: [
				{
					message: "An error occurred while parsing the URL.",
				},
			],
		};
	}
};
