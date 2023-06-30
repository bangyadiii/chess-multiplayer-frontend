import React, { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PlayerColorContext } from "../../context/PlayerColorContext";
import { EventsType } from "../../util/socketIO/events";
import * as cg from "chessground/types";
import { Chess, ChessInstance } from "chess.js";
import GameBoardContainer from "../organisms/GameBoardContainer";
import { CopyButtonWithConfirmation } from "../moleculs/LinkWithCopyButton";
import ROUTES from "../../routes";
import { JoinGameDTO, NewMoveDTO, StatusJoinDTO } from "../../events/dto/dto";
import { SocketContext } from "../../context/SocketContext";

export type MoveableColor = [] | [cg.Color] | ["white", "black"];

const ChessByGameId = (props: { myUserName: string | undefined }) => {
    const playerColorContext = useContext(PlayerColorContext);
    const socket = useContext(SocketContext);

    const FRONTEND_BASE_URL = import.meta.env.VITE_APP_HOST;
    if (!FRONTEND_BASE_URL || FRONTEND_BASE_URL == undefined) {
        throw new Error("FRONTEND BASE URL is required.");
    }
    // get the gameId from the URL here and pass it to the chessGame component as a prop.

    const { gameid } = useParams();

    const [currentGameInstance, setCurrentGameInstance] =
        useState<ChessInstance | null>(null);

    const [opponentSocketId, setOpponentSocketId] = React.useState("");
    const [opponentDidJoinTheGame, setOpponentDidJoinTheGame] =
        React.useState(false);
    const [opponentUserName, setOpponentUsername] = React.useState("");
    const [gameSessionDoesNotExist, setGameSessionDoesNotExist] =
        React.useState(false);

    React.useEffect(() => {
        console.log("Game session does not exist: ", gameSessionDoesNotExist);
        console.count("render");

        setCurrentGameInstance(new Chess());

        socket.on(EventsType.PLAYER_JOINED_ROOM, (payload: JoinGameDTO) => {
            if (
                payload.socketId !== undefined &&
                socket.id !== payload.socketId
            ) {
                setOpponentSocketId(payload.socketId);
                setOpponentDidJoinTheGame(true);
            }
        });

        socket.on(EventsType.JOIN_STATUS, (payload: StatusJoinDTO) => {
            alert("There are something error");
            console.log("status", payload.reason);
            if (!payload.successToJoin) {
                setGameSessionDoesNotExist(true);
            }
        });

        socket.on(EventsType.START_GAME, (opponentUserName) => {
            alert("Game is starting");
            if (opponentUserName !== props.myUserName) {
                setOpponentUsername(opponentUserName);
                setOpponentDidJoinTheGame(true);
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy.
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit(EventsType.REQUEST_USERNAME, gameid);
            }
        });

        socket.on(EventsType.GIVE_USERNAME, (socketId) => {
            if (socket.id !== socketId) {
                socket.emit(EventsType.RECEIVED_USERNAME, {
                    userName: props.myUserName,
                    gameId: gameid,
                });
            }
        });

        socket.on(EventsType.GET_OPPONENT_USERNAME, (data) => {
            if (socket.id !== data.socketId) {
                setOpponentUsername(data.userName);
                setOpponentSocketId(data.socketId);
                setOpponentDidJoinTheGame(true);
            }
        });

        socket.on(EventsType.OPPONENT_MOVE, (data: NewMoveDTO) => {
            console.log("Hey new move from opponent");
            const copyOfGame = {
                currentGameInstance,
            } as unknown as ChessInstance;
            copyOfGame.load(data.board); // load new fen from server
            setCurrentGameInstance(copyOfGame);
        });
    }, []);

    const renderGameContent = () => {
        if (gameid === undefined) {
            return <Navigate to={ROUTES.home} replace />;
        }
        if (gameSessionDoesNotExist) {
            return (
                <div>
                    <h1>Game Not Found. Use Valid URL.</h1>
                </div>
            );
        }

        return (
            <div>
                <main>
                    <h4> Lawan: {opponentUserName} </h4>
                    <section style={{ display: "flex" }}>
                        {currentGameInstance !== null && (
                            <GameBoardContainer
                                game={currentGameInstance}
                                gameProperty={{
                                    // TODO: add the socketId and the username
                                    gameId: gameid,
                                }}
                                color={
                                    playerColorContext.thisPlayerIsWhite
                                        ? (["white"] as MoveableColor)
                                        : (["black"] as MoveableColor)
                                }
                                size={750}
                            />
                        )}
                    </section>
                    <h4> Kamu: {props.myUserName} </h4>
                    <div className="w-[800px] flex items-center justify-between">
                        <input
                            className="px-6 py-3 w-10/12 font-mono"
                            type="text"
                            value={FRONTEND_BASE_URL + "/game/" + gameid}
                            disabled
                        />
                        <CopyButtonWithConfirmation
                            value={FRONTEND_BASE_URL + "/game/" + gameid}
                            text="copy"
                            successText="copied"
                        />
                    </div>
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
    };

    return (
        <React.Fragment>
            <div className="w-full min-h-screen flex items-center justify-center">
                {renderGameContent()}
            </div>
        </React.Fragment>
    );
};

export default ChessByGameId;
