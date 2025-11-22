import axios from "axios";

export const getPurchasedPhoneNumber = async (region) => {
	try {
		let phoneNumber;
		let text;

		phoneNumber = await axios.post(
			`https://fourcx-openai.azurewebsites.net/api/PurchasePhoneNumber?code=hhUU8UxWS2nx0z3NYMBabysd_tBRP6GC5at46h_46uqIAzFuNwKgIQ%3D%3D`,
			{ region: region }
		);

		// console.log("Phone Number", phoneNumber.data);
		text = phoneNumber.data;
		// text = "Phone number: +17795138970 purchased successfully!"; //sample data
		text = text.split("Phone number: ")[1];
		text = text.split("purchased successfully!")[0];
		text = text.trim();
		console.log("Phone Number", text);
		phoneNumber = text;

		return phoneNumber;
	} catch (error: any) {
		return console.log("Error", error?.message);
	}
};

export const releasePhoneNumber = async (phoneNumber) => {
	try {
		let releaseNumber = await axios.post(
			`https://fourcx-openai.azurewebsites.net/api/ReleasePhoneNumber?code=hhUU8UxWS2nx0z3NYMBabysd_tBRP6GC5at46h_46uqIAzFuNwKgIQ%3D%3D`,
			{ phone_number: phoneNumber }
		);
		// console.log("Phone Number", releaseNumber.data);
		releaseNumber = releaseNumber.data;
		return releaseNumber;
	} catch (error: any) {
		return console.log("Error", error?.message);
	}
};
