import { useCallback, useEffect, useContext } from "react";
import { ChessInstance, Move } from "chess.js";
import Chess from "../moleculs/chessground/Chess";
import { MoveableColor } from "../views/ChessByGameId";
import { EventsType } from "../../util/socketIO/events";
import { NewMoveDTO } from "../../events/dto/dto";
import { SocketContext } from "../../context/SocketContext";

export interface GameProperty {
    gameId: string;
    white?: {
        socketId: string;
        username: string;
    };
    black?: {
        socketId: string;
        username: string;
    };
}

interface BoardContainerProps {
    gameProperty: GameProperty;
    game: ChessInstance;
    color: MoveableColor;
    size: number;
}

function GameBoardContainer({
    gameProperty,
    size,
    game,
    color,
}: BoardContainerProps) {
    const socket = useContext(SocketContext);
    // TODO: move this function into ChessByGameId.tsx
    const sendMove = useCallback(
        (lastMove: Move): void => {
            console.log("tesstt", lastMove);
            socket.emit(EventsType.NEW_MOVE, lastMove);
        },
        [socket]
    );

    const updateGameCallback = useCallback(
        (modify: (g: ChessInstance) => Move | null): void => {
            console.debug("[Chess] updateGameCallback invoked");
            // const copyOfGame = { ...game } as unknown as ChessInstance;
            const lastMove = modify(game);
            if (lastMove !== null) {
                sendMove(lastMove);
            }
        },
        [game, sendMove]
    );

    useEffect(() => {
        socket.on(EventsType.OPPONENT_MOVE, (data: NewMoveDTO) => {
            const copyOfGame = { ...game } as unknown as ChessInstance;
            const loadSuccess = copyOfGame.load(data.board);
            if (!loadSuccess) {
                alert("failed to load");
            }
            console.debug("fen loaded");
        });
    });

    return (
        <>
            <div
                style={{
                    width: size,
                    height: size,
                }}
            >
                {
                    <Chess
                        game={game}
                        color={color}
                        onAfterMoveFinished={updateGameCallback}
                        gameId={gameProperty.gameId}
                    />
                }
            </div>
        </>
    );
}

export default GameBoardContainer;
