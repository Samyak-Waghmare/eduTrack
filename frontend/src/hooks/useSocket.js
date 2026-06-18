import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const useSocket = (lectureId = null) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((store) => store.auth);

    useEffect(() => {
        if (!user) return;

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
        });

        newSocket.on("connect", () => {

            newSocket.emit("register", user._id);
            
            if (lectureId) {
                newSocket.emit("join_lecture_qa", lectureId);
            }
        });

        setSocket(newSocket);

        return () => {
            if (lectureId) {
                newSocket.emit("leave_lecture_qa", lectureId);
            }
            newSocket.disconnect();
        };
    }, [user, lectureId]);

    return socket;
};
