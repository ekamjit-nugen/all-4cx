import express, { Express, Request, Response } from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import connectDB from "./core/DBConnection";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import crypto from "crypto";
import api from "./routes";

import { publicPath } from "./utils/constant";
import { kafkaConsumer } from "./utils/kafka/consumer";

const app: Express = express();

app.use(cors());
app.use(express.static(path.join(__dirname, `../${publicPath}`)));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(morgan("dev"))
app.use(
	express.json({
		limit: "50mb",
	})
);
connectDB();
// kafkaConsumer();

const authKeyGenerator = () => {
    try {
		const secretKey = crypto.randomBytes(40).toString('hex');
		return secretKey;
    } catch (error) {
        console.log("error", error);
    }
}
// console.log(authKeyGenerator());

app.get("/health", (req: Request, res: Response) => {
	res.status(200).send("OK");
});

app.use("/api", api);
app.use(
	express.urlencoded({
		extended: false,
		limit: "50mb",
	})
);

export default app;
