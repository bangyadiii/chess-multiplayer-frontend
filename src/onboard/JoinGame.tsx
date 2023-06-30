import { useParams } from "react-router-dom";
import { EventsType } from "../util/socketIO/events";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes";
import { JoinGameRequestDTO } from "../events/dto/dto";
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { Socket } from "socket.io-client";

/**
 * 'Join game' is where we actually join the game room.
 */

function joinGameRoom(socket: Socket, gameId: string, userName: string, isCreator: boolean) {
    /**
     * For this browser instance, we want
     * to join it to a gameRoom. For now
     * assume that the game room exists
     * on the backend.
     *
     *
     * TODO: handle the case when the game room doesn't exist.
     */
    const joinGameRequest: JoinGameRequestDTO = {
        gameId: gameId,
        userName: userName,
        isCreator: isCreator,
    };
    socket.emit(EventsType.PLAYER_JOINS_GAME, joinGameRequest);
}

interface JoinGameProp {
    userName: string;
    isCreator: boolean;
}

const JoinGame = (props: JoinGameProp) => {
    /**
     * Extract the 'gameId' from the URL.
     * the 'gameId' is the gameRoom ID.
     */
    const navigate = useNavigate();
    const { gameid } = useParams();
    const socket = useContext(SocketContext)

    useEffect(() => {
        if (gameid !== undefined) {
            joinGameRoom(socket, gameid, props.userName, props.isCreator);
        }

        console.log(`Socket [${socket.id}] -> JOINING THE GAME: `, gameid);
    }, []);

    if (gameid === undefined) {
        // TODO: redirect to home (path "/")
        navigate(ROUTES.home);
        return null;
    }
    return <></>;
};

export default JoinGame;
