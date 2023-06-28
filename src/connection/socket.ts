import { io } from "socket.io-client";
import { Events } from "./events";

const URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(URL);

let mySocketId: string;

interface CreateNewGameData {
    gameId: string;
    mySocketId: string;
}

socket.on(Events.CREATE_NEW_GAME, (data: CreateNewGameData) => {
    console.table(data);

    mySocketId = data.mySocketId;
});

export { socket, mySocketId };
