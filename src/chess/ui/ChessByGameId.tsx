import React from "react";
import { useParams } from "react-router-dom";
import chessMove from "../assets/moveSoundEffect.mp3";
import { PlayerColorContext } from "../../context/color_context";
import VideoChatApp from "../../connection/videochat";
import { socket } from "../../connection/socket";
import { EventsType } from "../../util/socketIO/events";
import Chessboard from "./chessground/Chessground";
import { ChessInstance } from "chess.js";

export interface StatusJoinDTO {
    successToJoin: boolean;
    reason?: string;
    data?: {
        myUsername: string;
        opponentUsername: string;
    };
}

const ChessGameWrapper = (props: { myUserName: string | undefined }) => {
    const playerColorContext = React.useContext(PlayerColorContext);

    const FRONTEND_BASE_URL = import.meta.env.VITE_APP_HOST;
    // get the gameId from the URL here and pass it to the chessGame component as a prop.
    const { gameid } = useParams();
    const [opponentSocketId, setOpponentSocketId] = React.useState("");
    const [opponentDidJoinTheGame, setOpponentDidJoin] = React.useState(false);
    const [opponentUserName, setUserName] = React.useState("");
    const [gameSessionDoesNotExist, setGameSessionDoesNotExist] =
        React.useState(false);

    const updateGameCallback = React.useCallback(
        (modify: (g: ChessInstance) => void) => {
            console.debug("[Chess] updateGameCallback invoked");
            const copyOfGame = { ...game };
            modify(copyOfGame);
            onGameChanged(copyOfGame);
        },
        [game, onGameChanged]
    );

    React.useEffect(() => {
        socket.on(EventsType.PLAYER_JOINED_ROOM, (statusUpdate) => {
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId);
            }
        });

        socket.on(EventsType.JOIN_STATUS, (payload: StatusJoinDTO) => {
            console.debug(payload);
            alert("masuk game: " + payload.reason);
            if (!payload.successToJoin) {
                setGameSessionDoesNotExist(true);
            }
        });

        socket.on(EventsType.START_GAME, (opponentUserName) => {
            alert("GAME START! Opponent Username: " + opponentUserName);
            if (opponentUserName !== props.myUserName) {
                setUserName(opponentUserName);
                setOpponentDidJoin(true);
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy.
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit(EventsType.REQUEST_USERNAME, gameid);
            }
        });

        socket.on(EventsType.GIVE_USERNAME, (socketId) => {
            if (socket.id !== socketId) {
                console.log("give userName stage: " + props.myUserName);
                socket.emit(EventsType.RECEIVED_USERNAME, {
                    userName: props.myUserName,
                    gameId: gameid,
                });
            }
        });

        socket.on(EventsType.GET_OPPONENT_USERNAME, (data) => {
            if (socket.id !== data.socketId) {
                setUserName(data.userName);
                setOpponentSocketId(data.socketId);
                setOpponentDidJoin(true);
            }
        });
    }, [gameid, props.myUserName]);

    const renderGameContent = () => {
        if (gameid !== undefined && opponentDidJoinTheGame) {
            return (
                <div>
                    <main>
                        <h4> Lawan: {opponentUserName} </h4>
                        <section style={{ display: "flex" }}>
                            <Chessboard
                                onAfterMoveFinished={}
                                gameId={gameid}
                                thisPlayerIsWhite={
                                    playerColorContext.thisPlayerIsWhite
                                }
                            />
                        </section>
                        <h4> Kamu: {props.myUserName} </h4>
                    </main>
                    <aside>
                        {/* <VideoChatApp
                            mySocketId={socket.id}
                            opponentSocketId={opponentSocketId}
                            myUserName={props.myUserName as string}
                            opponentUserName={opponentUserName}
                        /> */}
                    </aside>
                </div>
            );
        } else if (gameSessionDoesNotExist) {
            return (
                <div>
                    <h1 style={{ textAlign: "center", marginTop: "200px" }}>
                        Game Not Found. Use Valid URL.
                    </h1>
                </div>
            );
        } else {
            return (
                <div>
                    <h1
                        style={{
                            textAlign: "center",
                            marginTop: String(window.innerHeight / 8) + "px",
                        }}
                    >
                        Hey <strong>{props.myUserName}</strong>, salin dan
                        tempel URL di bawah ini untuk dikirimkan ke temanmu:
                    </h1>
                    <div>
                        <input
                            id="game_url"
                            style={{
                                marginLeft: `${window.innerWidth / 2 - 290}px`,
                                marginTop: "30px",
                                width: "580px",
                                height: "30px",
                                fontFamily: "monospace",
                                borderRadius: "4px",
                                padding: "8px",
                                backgroundColor: "navy",
                                color: "whitesmoke",
                                resize: "none",
                            }}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                            value={FRONTEND_BASE_URL + "/game/" + gameid}
                            disabled
                        />
                    </div>
                    <br></br>
                    <h1 style={{ textAlign: "center", marginTop: "100px" }}>
                        Menunggu lawan lain bergabung dalam permainan...
                    </h1>
                </div>
            );
        }
    };

    return <React.Fragment>{renderGameContent()}</React.Fragment>;
};

export default ChessGameWrapper;
