import React, { useEffect, useRef, useState, useCallback } from "react";
import { socket } from "../../../connection/socket";
import { EventsType } from "../../../util/socketIO/events";
import { NewMoveDTO } from "../../../events/dto/dto";
import { Chess, ChessInstance, Square } from "chess.js";
import Chessground from "@react-chess/chessground";
import * as cg from "chessground/types";

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

export interface ChessGameProps {
    thisPlayerIsWhite: boolean;
    myUserName?: string;
    opponentUserName?: string;
    gameId: string;
    onAfterMoveFinished: (callback: (g: ChessInstance) => void) => void;
}

const ChessGame: React.FC<ChessGameProps> = (props) => {
    const [playerTurnToMoveIsWhite, setPlayerTurnToMoveIsWhite] =
        useState(false);
    const [whiteKingInCheck, setWhiteKingInCheck] = useState(false);
    const [blackKingInCheck, setBlackKingInCheck] = useState(false);
    const [fen, setFen] = useState("start");
    const gameRef = useRef<ChessInstance | null>(null);

    useEffect(() => {
        console.debug("my username", props.myUserName);
        console.debug("opponent username", props.opponentUserName);
        gameRef.current = new Chess();
    }, []);

    const onAfter = useCallback(
        (orig: cg.Key, dest: cg.Key, metadata: cg.MoveMetadata) => {
            props.onAfterMoveFinished((g: ChessInstance) => {
                g.move({
                    from: orig as Square,
                    to: dest as Square,
                    promotion: "q", // always promote to a queen for example simplicity
                });
            });
        },
        [props.onAfterMoveFinished]
    );

    return (
        <div style={{ width: "750px", height: "750px" }}>
            <Chessground
                contained={true}
                config={{
                    fen: fen,
                    predroppable: {
                        enabled: true,
                    },
                    movable: {
                        events: {
                            after: onAfter,
                        },
                    },
                }}
            />
        </div>
    );
};

export default ChessGame;
