import http from "http";
import "dotenv/config";
import app from "./server";
import EnvManager from "./core/EnvManager";

let server = http.createServer(app);

const io = require('socket.io')(server , {
	cors: {
		origin: '*'
	}
});
global.io=io;

const PORT = EnvManager.getAppPort();

server.listen(PORT, () => console.log("App listening on port", PORT));