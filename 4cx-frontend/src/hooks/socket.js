import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketUrl = process.env.REACT_APP_BASE_URL_SOCKET;

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  const emitEvent = (eventName, data) => {
    if (socket?.connected) {
      socket.emit(eventName, data);
    }
  };

  useEffect(() => {
    const socketIo = io(socketUrl);
    setSocket(socketIo);

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket();
      }
    };
  }, [socketUrl]);

  return { socket, emitEvent };
};

export default useSocket;
