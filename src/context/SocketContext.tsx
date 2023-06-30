import { createContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";
import { EventsType } from "../util/socketIO/events";

const URL = import.meta.env.VITE_BACKEND_URL;
if (!URL || URL === undefined) throw new Error("Service URL is required.");

const socket = io(URL, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2_500,
    transports: ["websocket"],
});

const SocketContext = createContext<Socket>(socket);

const SocketProvider = ({ children }: any) => {

    useEffect(() => {

        socket.on(EventsType.CONNECT, () =>
            console.info("[CONNECTED] Socket ID:", socket.id)
        );
        socket.on(EventsType.DISCONNECT, () =>
            console.info("[DISCONNECTED] Socket ID:", socket.id)
        );

        return () => {
            socket.off(EventsType.CONNECT);
            socket.off(EventsType.DISCONNECT);
            socket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };
