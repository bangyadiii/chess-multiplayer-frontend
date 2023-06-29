import { useParams } from "react-router-dom";
import { socket } from "../connection/socket";
import { EventsType } from "../util/socketIO/events";
import { useNavigate } from "react-router-dom";

/**
 * 'Join game' is where we actually join the game room.
 */
export interface JoinGameRequest {
    gameId: string;
    isCreator: boolean;
    userName: string;
}

function joinGameRoom(gameId: string, userName: string, isCreator: boolean) {
    /**
     * For this browser instance, we want
     * to join it to a gameRoom. For now
     * assume that the game room exists
     * on the backend.
     *
     *
     * TODO: handle the case when the game room doesn't exist.
     */
    const joinGameRequest = {
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
    if (gameid === undefined) {
        // TODO: redirect to home (path "/")
        navigate("/");
        return null;
    }
    joinGameRoom(gameid, props.userName, props.isCreator);
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Chess</h1>
            <h3 style={{ textAlign: "center" }}>
                Made with by{" "}
                <a href="https://github.com/bangyadiii/" target="_blank">
                    Tri Adi
                </a>
            </h3>
        </div>
    );
};

export default JoinGame;
