import React from "react";
import { useParams } from "react-router-dom";
import chessMove from "../assets/moveSoundEffect.mp3";
import { ColorContext } from "../../context/color_context";
import VideoChatApp from "../../connection/videochat";
import { socket } from "../../connection/socket";
import ChessGame from "./chessgame";
import useSound from "use-sound";
import { Events } from "../../connection/events";

const ChessGameWrapper = (props: { myUserName: string | undefined }) => {
    const color = React.useContext(ColorContext);

    const FRONTEND_BASE_URL = import.meta.env.VITE_APP_HOST;
    // get the gameId from the URL here and pass it to the chessGame component as a prop.
    const { gameid } = useParams();
    const [play] = useSound(chessMove);
    const [opponentSocketId, setOpponentSocketId] = React.useState("");
    const [opponentDidJoinTheGame, setOpponentDidJoin] = React.useState(false);
    const [opponentUserName, setUserName] = React.useState("");
    const [gameSessionDoesNotExist, setGameSessionDoesNotExist] =
        React.useState(false);

    React.useEffect(() => {
        socket.on(Events.PLAYER_JOINED_ROOM, (statusUpdate) => {
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId);
            }
        });

        socket.on(Events.JOIN_STATUS, (statusUpdate) => {
            console.debug(statusUpdate);
            alert(statusUpdate);
            if (
                statusUpdate === "GAME_SESSION.NOT_FOUND" ||
                statusUpdate === "GAME_SESSION.FULL"
            ) {
                setGameSessionDoesNotExist(true);
            }
        });

        socket.on(Events.START_GAME, (opponentUserName) => {
            alert("START! Your Username" + opponentUserName);
            if (opponentUserName !== props.myUserName) {
                setUserName(opponentUserName);
                setOpponentDidJoin(true);
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy.
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit(Events.REQUEST_USERNAME, gameid);
            }
        });

        socket.on(Events.GIVE_USERNAME, (socketId) => {
            if (socket.id !== socketId) {
                console.log("give userName stage: " + props.myUserName);
                socket.emit(Events.RECEIVED_USERNAME, {
                    userName: props.myUserName,
                    gameId: gameid,
                });
            }
        });

        socket.on(Events.GET_OPPONENT_USERNAME, (data) => {
            if (socket.id !== data.socketId) {
                setUserName(data.userName);
                console.log("data.socketId:", data.socketId);
                setOpponentSocketId(data.socketId);
                setOpponentDidJoin(true);
            }
        });
    }, []);

    const renderGameContent = () => {
        if (gameid !== undefined && opponentDidJoinTheGame) {
            return (
                <div>
                    <h4> Lawan: {opponentUserName} </h4>
                    <div style={{ display: "flex" }}>
                        <ChessGame
                            playAudio={play}
                            gameId={gameid}
                            color={color.didRedirect}
                        />
                        <VideoChatApp
                            mySocketId={socket.id}
                            opponentSocketId={opponentSocketId}
                            myUserName={props.myUserName as string}
                            opponentUserName={opponentUserName}
                        />
                    </div>
                    <h4> Kamu: {props.myUserName} </h4>
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
                    <textarea
                        style={{
                            marginLeft:
                                String(window.innerWidth / 2 - 290) + "px",
                            marginTop: "30px",
                            width: "580px",
                            height: "30px",
                        }}
                        onFocus={(event) => {
                            console.debug("sd");
                            event.target.select();
                        }}
                        value={FRONTEND_BASE_URL + "/game/" + gameid}
                        typeof="text"
                    ></textarea>
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
