import { createContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";
import { EventsType } from "../util/socketIO/events";

const URL = import.meta.env.VITE_BACKEND_URL;
if (!URL || URL === undefined) throw new Error("Service URL is required.");

const SocketContext = createContext<Socket>({} as Socket);

const SocketProvider = ({ children }: any) => {
    const [socket, setSocket] = useState<Socket>({} as Socket);

    useEffect(() => {
        const newSocket = io(URL, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2_500,
            transports: ["websocket"],
        });

        setSocket(newSocket);

        socket.on(EventsType.CONNECT, () =>
            console.info("[CONNECTED] Socket ID", socket.id)
        );
        socket.on(EventsType.DISCONNECT, () =>
            console.info("[DISCONNECTED] Socket ID", socket.id)
        );

        return () => {
            newSocket.off(EventsType.CONNECT)
            newSocket.off(EventsType.DISCONNECT)
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };
