import { useEffect, useState } from "react";
import Chessground from "@react-chess/chessground";
import { MoveableColor as MoveableColor } from "../../views/ChessByGameId";
import { ChessInstance, SQUARES, Square } from "chess.js";
import { Dests, Key, KeyPair } from "chessground/types";
import { Config } from "chessground/config";

interface StyledChessBoardProps {
    game: ChessInstance;
    config: Partial<Config>;
    userColor: MoveableColor;
}

const moveableColorProp = (c: MoveableColor) => {
    if (c.length === 0) return undefined;
    if (c.length === 1) return c[0];
    return "both";
};

const findValidMoves = (chess: ChessInstance): Map<Key, Key[]> => {
    const destination = new Map();
    if (SQUARES !== undefined) {
        SQUARES.forEach((square: Square) => {
            const ms = chess.moves({ square, verbose: true });
            if (ms.length) {
                destination.set(
                    square,
                    ms.map((m) => m.to)
                );
            }
        });
    }

    return destination;
};

type CgKeyPair = [Key, Key];

const findLastMove = (chess: ChessInstance): CgKeyPair | null => {
    const verboseHistory = chess.history({ verbose: true });
    const lastMoveOrNull =
        (verboseHistory.length > 0 &&
            verboseHistory[verboseHistory.length - 1]) ||
        null;
    const lastMovePair =
        (lastMoveOrNull &&
            ([lastMoveOrNull.from, lastMoveOrNull.to] as CgKeyPair)) ||
        null;
    return lastMovePair;
};

function StyledChessBoard(props: StyledChessBoardProps) {
    const [validMoves, setValidMoves] = useState<Map<Key, Key[]>>(new Map());
    const [lastMove, setLastMove] = useState<KeyPair | null>(null);
    const [chessgroundConfig, setChessgroundConfig] = useState<Partial<Config>>(
        {} as Partial<Config>
    );

    useEffect(() => {
        console.debug("[Chess] Recalculating valid moves.. ");
        const newValidMoves = findValidMoves(props.game);
        console.debug(
            `[Chess] Number of moveable pieces: ${newValidMoves.size}`
        );
        setValidMoves(newValidMoves);

        const newLastMove = findLastMove(props.game);
        console.debug(`[Chess] Found last move: ${newLastMove}`);
        setLastMove(newLastMove);
    }, [props.game]);

    // set Chessboard config
    useEffect(() => {
        console.debug(
            "[StyledChessBoard] Rerender the chessboard: ",
            props.config.movable
        );
        setChessgroundConfig({
            ...props.config,
            drawable: {
                enabled: true,
                ...props.config.drawable,
            },
            fen: props.game.fen(),
            turnColor: props.game.turn() === "b" ? "black" : "white", // turn to play. white | black
            viewOnly: props.userColor.length === 0 || props.game.game_over(), // don't bind events: the user will never be able to move pieces around
            lastMove: lastMove,
            ...props.config,
            movable: {
                color: moveableColorProp(props.userColor),
                dests: props.config.movable?.dests || (validMoves as Dests),
                free: true,
                ...props.config.movable,
            },
            premovable: {
                ...props.config.premovable,
                enabled: true, // "premoves" are currently not supported
            },
            highlight: {
                lastMove: true,
                check: true,
                ...props.config.highlight,
            },
            events: {
                ...props.config.events,
            },
        } as Config);
    }, [lastMove, props.config, props.game, props.userColor, validMoves]);

    return (
        <>
            <Chessground contained={true} config={chessgroundConfig} />
        </>
    );
}

export default StyledChessBoard;
