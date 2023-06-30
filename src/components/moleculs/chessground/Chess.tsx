/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback, useEffect } from "react";
import { ChessInstance, Move, Square } from "chess.js";
import * as cg from "chessground/types";
import { Config as CgConfig } from "chessground/config";
import { MoveableColor } from "../../views/ChessByGameId";

import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import StyledChessBoard from "./StyledChessBoard";

export interface ChessGameProps {
    game: ChessInstance;
    color: MoveableColor;
    myUserName?: string;
    opponentUserName?: string;
    gameId: string;
    onAfterMoveFinished: (callback: (g: ChessInstance) => Move | null) => void;
}

const Chess: React.FC<ChessGameProps> = (props) => {
    const [chessgroundConfig, setChessgroundConfig] = useState<
        Partial<CgConfig>
    >({} as Partial<CgConfig>);

    const onAfter = useCallback(
        (orig: cg.Key, dest: cg.Key, metadata: cg.MoveMetadata) => {
            props.onAfterMoveFinished((g: ChessInstance): Move | null => {
                const move = g.move({
                    from: orig as Square,
                    to: dest as Square,
                    promotion: "q", // always promote to a queen for example simplicity
                });
                return move;
            });
        },
        [props]
    );

    useEffect(() => {
        // For config, see: https://github.com/lichess-org/chessground/blob/master/src/config.ts#L7-L90
        setChessgroundConfig({
            orientation: props.color.length === 1 ? props.color[0] : "white",
            movable: {
                events: {
                    after: onAfter, // called after the move has been played
                },
            },
            events: {
                change: () => {}, // called after the situation changes on the board
                // called after a piece has been moved.
                // capturedPiece is undefined or like {color: 'white'; 'role': 'queen'}
                move: (
                    orig: cg.Key,
                    dest: cg.Key,
                    capturedPiece?: cg.Piece
                ) => {},
                dropNewPiece: (piece: cg.Piece, key: cg.Key) => {},
                select: (key: cg.Key) => {}, // called when a square is selected
                insert: (elements: cg.Elements) => {}, // when the board DOM has been (re)inserted
            },
        } as Partial<CgConfig>);
    }, [props.color, onAfter]);

    return (
        <div style={{ width: "750px", height: "750px" }}>
            <StyledChessBoard
                game={props.game}
                config={chessgroundConfig}
                userColor={props.color}
            />
        </div>
    );
};

export default Chess;
