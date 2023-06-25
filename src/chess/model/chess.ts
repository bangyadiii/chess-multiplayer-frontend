import {
    Chess,
    ChessInstance,
    Move,
    ShortMove,
    Square as SquareChessJS,
} from "chess.js";
import { ChessPiece } from "./piece";
import Square from "./square";

// when indexing, remember: [y][x]
/**
 * if the player color is black, mkae sure to invert the board
 */

export const PIECE_TOTAL = 8;
export const PIECE_PIXEL_SIZE = 90;
export const PIECE_MARGIN_PIXEL_SIZE = 15;
export const WHITE_BACKRANK_ID = [
    "wr1",
    "wn1",
    "wb1",
    "wq1",
    "wk1",
    "wb2",
    "wn2",
    "wr2",
];
export const BLACK_BACKRANK_ID = [
    "br1",
    "bn1",
    "bb1",
    "bq1",
    "bk1",
    "bb2",
    "bn2",
    "br2",
];
const squareChessJSValues: SquareChessJS[] | string[] = [
    "a8",
    "a7",
    "a6",
    "a5",
    "a4",
    "a3",
    "a2",
    "a1",
    "b8",
    "b7",
    "b6",
    "b5",
    "b4",
    "b3",
    "b2",
    "b1",
    "c8",
    "c7",
    "c6",
    "c5",
    "c4",
    "c3",
    "c2",
    "c1",
    "d8",
    "d7",
    "d6",
    "d5",
    "d4",
    "d3",
    "d2",
    "d1",
    "e8",
    "e7",
    "e6",
    "e5",
    "e4",
    "e3",
    "e2",
    "e1",
    "f8",
    "f7",
    "f6",
    "f5",
    "f4",
    "f3",
    "f2",
    "f1",
    "h8",
    "h7",
    "h6",
    "h5",
    "h4",
    "h3",
    "h2",
    "h1",
];
export type ChessBoard = Array<Array<Square>>;

class Game {
    
    public thisPlayersColorIsWhite: boolean;
    public chessBoard: ChessBoard;
    public chess: ChessInstance;
    public toCoord: Record<number, number> = {};
    public toCoord2: Record<number, number> = {};
    public toAlphabet: Record<number, string> = {};
    public toAlphabet2: Record<string, number> = {};
    public nQueens: number;

    constructor(payload: { thisPlayersColorIsWhite: boolean }) {
        this.thisPlayersColorIsWhite = payload.thisPlayersColorIsWhite;
        this.chessBoard = this.makeStartingBoard();
        this.chess = new Chess();

        this.toCoord = this.thisPlayersColorIsWhite
            ? {
                  0: 8,
                  1: 7,
                  3: 5,
                  4: 4,
                  5: 3,
                  6: 2,
                  7: 1,
              }
            : {
                  0: 1,
                  1: 2,
                  2: 3,
                  3: 4,
                  4: 5,
                  5: 6,
                  7: 8,
              };

        this.toAlphabet = this.thisPlayersColorIsWhite
            ? {
                  0: "a",
                  1: "b",
                  2: "c",
                  3: "d",
                  4: "e",
                  5: "f",
                  6: "g",
                  7: "h",
              }
            : {
                  0: "h",
                  1: "g",
                  2: "f",
                  3: "e",
                  4: "d",
                  5: "c",
                  6: "b",
                  7: "a",
              };

        this.toCoord2 = this.thisPlayersColorIsWhite
            ? {
                  8: 0,
                  7: 1,
                  6: 2,
                  5: 3,
                  4: 4,
                  3: 5,
                  2: 6,
                  1: 7,
              }
            : {
                  1: 0,
                  2: 1,
                  3: 2,
                  4: 3,
                  5: 4,
                  6: 5,
                  7: 6,
                  8: 7,
              };

        this.toAlphabet2 = this.thisPlayersColorIsWhite
            ? {
                  a: 0,
                  b: 1,
                  c: 2,
                  d: 3,
                  e: 4,
                  f: 5,
                  g: 6,
                  h: 7,
              }
            : {
                  h: 0,
                  g: 1,
                  f: 2,
                  e: 3,
                  d: 4,
                  c: 5,
                  b: 6,
                  a: 7,
              };

        this.nQueens = 1;
    }

    public getBoard(): ChessBoard {
        return this.chessBoard;
    }

    public setBoard(newBoard: any[][]): void {
        this.chessBoard = newBoard;
    }

    public movePiece(pieceID: string, to: number[], isMyMove: boolean) {
        const to2D: Record<number, number> = isMyMove
            ? {
                  105: 0,
                  195: 1,
                  285: 2,
                  375: 3,
                  465: 4,
                  555: 5,
                  645: 6,
                  735: 7,
              }
            : {
                  105: 7,
                  195: 6,
                  285: 5,
                  375: 4,
                  465: 3,
                  555: 2,
                  645: 1,
                  735: 0,
              };

        const currentBoard = this.getBoard();

        const pieceCoordinates = this.findPiece(currentBoard, pieceID);

        // can't find piece coordinates
        if (pieceCoordinates === null) {
            return;
        }

        const x = pieceCoordinates[1];
        const y = pieceCoordinates[0];

        // new coordinates
        const to_y = to2D[to[1]];
        const to_x = to2D[to[0]];

        const originalPiece = currentBoard[y][x].getPiece();

        if (y === to_y && x === to_x) {
            return "moved in the same position";
        }

        /**
         * In order fot this method to do anything meaningful,
         * the 'reassign const' line of code must run. Therefore,
         * for it to run, we must check first that the given move is valid
         */

        const isPromotion = this.isPawnPromotion(to, pieceID[1]);
        const move: ShortMove = {
            from: "a8",
            to: "a8",
        };

        const moveFrom = this.toChessMove([x, y], to2D);
        if (moveFrom !== undefined) {
            move.from = moveFrom;
        }
        const moveTo = this.toChessMove(to, to2D);
        if (moveTo !== undefined) {
            move.to = moveTo;
        }
        if (isPromotion) {
            move.promotion = "q";
        }

        const moveAttempt: Move | null = this.chess.move(move);

        console.debug(moveAttempt);

        if (moveAttempt === null) {
            return "invalid move";
        }

        if (moveAttempt.flags === "e") {
            const move = moveAttempt.to;

            const x: number = this.toAlphabet2[move[0]];
            let y: number;
            if (moveAttempt.color === "w") {
                y = parseInt(move[1], 10) - 1;
            } else {
                y = parseInt(move[1], 10) + 1;
            }
            const piece = this.toCoord2[y];
            currentBoard[piece][x].setPiece(null);
        }

        // TODO: check if players is castling

        // changing the board model
        const reassign = isPromotion
            ? currentBoard[to_y][to_x].setPiece(
                  new ChessPiece({
                      name: "queen",
                      isAttacked: false,
                      color: pieceID[0] === "W" ? "white" : "black",
                      id:
                          pieceID[0] === "W"
                              ? "wq" + this.nQueens
                              : "bq" + this.nQueens,
                  })
              )
            : currentBoard[to_y][to_x].setPiece(originalPiece);

        if (reassign !== "user tried to capture their own piece") {
            currentBoard[y][x].setPiece(null);
        } else {
            return reassign;
        }

        const checkMate = this.chess.in_checkmate()
            ? "has been checkmated"
            : "has not been chackmated";
        console.debug(this.chess.turn(), checkMate);
        if (this.chess.in_checkmate()) {
            return this.chess.turn() + checkMate;
        }

        // changes the fill color of the opponent's king is in check

        const check = this.chess.in_check()
            ? " is in check"
            : " is not in check";
        console.log(this.chess.turn() + check);

        if (this.chess.in_check()) {
            return this.chess.turn() + check;
        }

        console.debug(currentBoard);

        this.setBoard(currentBoard);
    }

    /**
     * convert move into acceptable chess.js move
     * @param finalPosition : number[]
     * @param to2D: Record <number, number>
     * @return string eg: 'e4', 'f6', etc
     */
    public toChessMove(
        finalPosition: number[],
        to2D: Record<number, number>
    ): SquareChessJS | undefined {
        let move: string;

        if (finalPosition[0] > 100) {
            move =
                this.toAlphabet[to2D[finalPosition[0]]] +
                this.toCoord[to2D[finalPosition[1]]];
        } else {
            move =
                this.toAlphabet[finalPosition[0]] +
                this.toCoord[finalPosition[1]];
        }

        console.debug("proposed move:", move);
        if (squareChessJSValues.includes(move as SquareChessJS)) {
            return move as SquareChessJS;
        }
        return undefined;
    }

    public isPawnPromotion(to: number[], piece: string): boolean {
        const res = piece === "p" && (to[1] === 105 || to[1] === 735);
        if (res) {
            this.nQueens += 1;
        }
        return res;
    }

    public findPiece(board: ChessBoard, pieceId: string): number[] | null {
        for (let i = 0; i < PIECE_TOTAL; i++) {
            for (let j = 0; j < PIECE_TOTAL; j++) {
                if (board[i][j].getPieceIdOnThisSquare() === pieceId) {
                    return [j, i];
                }
            }
        }
        return null;
    }

    public isCastle(moveAttempt: Move): {
        didCastle: boolean;
        x?: number;
        y?: number;
        to_x?: number;
        to_y?: number;
    } {
        /**
         *  Assume moveAttempt is legal
         *  {moveAttempt} -> {boolean  x, y, to_x, to_y}
         *
         * returns if a player has castled, the final position of
         * the rook (to_x, to_y), and the original position of the rook (x, y)
         *
         */
        const piece = moveAttempt.piece;

        const move = {
            from: moveAttempt.from,
            to: moveAttempt.to,
        };

        const isBlackCastle =
            (move.from === "e1" && move.to === "g1") ||
            (move.from === "e1" && move.to === "c1");
        const isWhiteCastle =
            (move.from === "e8" && move.to === "g8") ||
            (move.from === "e8" && move.to === "c8");

        if (!(isWhiteCastle || isBlackCastle) || piece !== "k") {
            return {
                didCastle: false,
            };
        }

        let originalPositionOfRook;
        let newPositionOfRook;

        if (move.from === "e1" && move.to === "g1") {
            originalPositionOfRook = "h1";
            newPositionOfRook = "f1";
        } else if (move.from === "e1" && move.to === "c1") {
            originalPositionOfRook = "a1";
            newPositionOfRook = "d1";
        } else if (move.from === "e8" && move.to === "g8") {
            originalPositionOfRook = "h8";
            newPositionOfRook = "f8";
        } else {
            // e8 to c8
            originalPositionOfRook = "a8";
            newPositionOfRook = "d8";
        }

        return {
            didCastle: true,
            x: this.toAlphabet2[originalPositionOfRook[0]],
            y: this.toAlphabet2[originalPositionOfRook[1]],
            to_x: this.toAlphabet2[newPositionOfRook[0]],
            to_y: this.toAlphabet2[newPositionOfRook[1]],
        };
    }

    private makeStartingBoard(): ChessBoard {
        const backRank = [
            "rank",
            "knight",
            "bishop",
            "queen",
            "king",
            "bishop",
            "knight",
            "rook",
        ];
        const startingChessBoard: ChessBoard = new Array<Array<Square>>();

        for (let verticalIndex = 0; verticalIndex < 8; verticalIndex++) {
            startingChessBoard.push([]);
            for (
                let horizontalIndex = 0;
                horizontalIndex < 8;
                horizontalIndex++
            ) {
                const coordinatesOnCanvas = [
                    (horizontalIndex + 1) * PIECE_PIXEL_SIZE +
                        PIECE_MARGIN_PIXEL_SIZE,
                    (verticalIndex + 1) * PIECE_PIXEL_SIZE +
                        PIECE_MARGIN_PIXEL_SIZE,
                ];
                const emptyPiece = new Square({
                    y: horizontalIndex,
                    x: verticalIndex,
                    pieaceOnThisSquare: null,
                    canvasCoord: coordinatesOnCanvas,
                });
                startingChessBoard[verticalIndex].push(emptyPiece);
            }
        }

        for (let j = 0; j < 8; j += 7) {
            for (let i = 0; i < 8; i++) {
                if (j == 0) {
                    // top
                    console.debug(backRank[i]);
                    const rankPiece = new ChessPiece({
                        name: backRank[i],
                        isAttacked: false,
                        color: this.thisPlayersColorIsWhite ? "black" : "white",
                        id: this.thisPlayersColorIsWhite
                            ? BLACK_BACKRANK_ID[i]
                            : WHITE_BACKRANK_ID[i],
                    });

                    startingChessBoard[j][
                        this.thisPlayersColorIsWhite ? i : 7 - i
                    ].setPiece(rankPiece);

                    const pawnPiece = new ChessPiece({
                        name: "pawn",
                        isAttacked: false,
                        color: this.thisPlayersColorIsWhite ? "black" : "white",
                        id: this.thisPlayersColorIsWhite ? "bp" + i : "wp" + i,
                    });

                    startingChessBoard[j + 1][
                        this.thisPlayersColorIsWhite ? i : 7 - i
                    ].setPiece(pawnPiece);
                } else {
                    // bottom
                    const pawnPiece = new ChessPiece({
                        name: "pawn",
                        isAttacked: false,
                        color: this.thisPlayersColorIsWhite ? "white" : "black",
                        id: this.thisPlayersColorIsWhite ? "wp" + i : "bp" + i,
                    });

                    startingChessBoard[j - 1][
                        this.thisPlayersColorIsWhite ? i : 7 - i
                    ].setPiece(pawnPiece);

                    const rankPiece = new ChessPiece({
                        name: backRank[i],
                        isAttacked: false,
                        color: this.thisPlayersColorIsWhite ? "white" : "black",
                        id: this.thisPlayersColorIsWhite
                            ? WHITE_BACKRANK_ID[i]
                            : BLACK_BACKRANK_ID[i],
                    });
                    startingChessBoard[j][
                        this.thisPlayersColorIsWhite ? i : 7 - i
                    ].setPiece(rankPiece);
                }
            }
        }
        return startingChessBoard;
    }

    public revertToPreviousPosition(selectedId: string) {
        throw new Error("Method not implemented.");
    }
}

export default Game;
