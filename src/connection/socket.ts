import { io } from "socket.io-client";
import { EventsType } from "../util/socketIO/events";

const URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(URL);

let mySocketId: string;

interface CreateNewGameData {
    gameId: string;
    mySocketId: string;
}

socket.on(EventsType.CREATE_NEW_GAME, (data: CreateNewGameData) => {
    console.table(data);

    mySocketId = data.mySocketId;
});

export { socket, mySocketId };
