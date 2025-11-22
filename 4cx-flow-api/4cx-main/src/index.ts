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

io.on('connection', (socket) => {
	console.log('A user connected:', socket.id);
  
	// Handle joining a room
	socket.on('room', (roomId) => {
	  if (roomId) {
		socket.join(roomId);
		console.log(`User ${socket.id} joined room ${roomId}`);
	  } else {
		console.log('Room ID not provided');
	  }
	});
})

global.io=io;

const PORT = EnvManager.getAppPort();

server.listen(PORT, () => console.log("App listening on port", PORT));