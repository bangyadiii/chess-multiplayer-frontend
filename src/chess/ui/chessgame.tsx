import React, { Component } from "react";
import { Stage, Layer } from "react-konva";
import Game from "../model/chess";
import Board from "../assets/chessBoard.png";
import Piece from "./piece";
import piecemap from "./piecemap";
import { socket } from "../../connection/socket";
import { ChessBoard } from "../model/chess";
import { Events } from "../../connection/events";

export interface ChessGameProps {
    color: boolean;
    myUserName?: string;
    opponentUserName?: string;
    gameId: string;
    playAudio?: () => void;
    // properti lainnya
}

class ChessGame extends Component<ChessGameProps> {
    state = {
        gameState: new Game({
            thisPlayersColorIsWhite: this.props.color,
        }),
        draggedPieceTargetId: "", // empty string means no piece is being dragged
        playerTurnToMoveIsWhite: true,
        whiteKingInCheck: false,
        blackKingInCheck: false,
    };

    componentDidMount() {
        console.debug("my username", this.props.myUserName);
        console.debug("opponent username", this.props.opponentUserName);
        // register event listeners
        socket.on(Events.OPPONENT_MOVE, (move) => {
            // move == [pieceId, finalPosition]
            // console.log("opponenet's move: " + move.selectedId + ", " + move.finalPosition)
            if (move.playerColorThatJustMovedIsWhite !== this.props.color) {
                this.movePiece(
                    move.selectedId,
                    move.finalPosition,
                    this.state.gameState,
                    false
                );
                this.setState({
                    playerTurnToMoveIsWhite:
                        !move.playerColorThatJustMovedIsWhite,
                });
            }
        });
    }

    startDragging = (event: any) => {
        this.setState({
            draggedPieceTargetId: event.target.attrs.id,
        });
    };

    endDragging = (event: any) => {
        const currentGame = this.state.gameState;
        const currentBoard = currentGame.getBoard();
        const finalPosition = this.inferCoord(
            event.target.x() + 90,
            event.target.y() + 90,
            currentBoard
        );

        const selectedId = this.state.draggedPieceTargetId;
        if (finalPosition !== undefined) {
            this.movePiece(selectedId, finalPosition, currentGame, true);
        }
    };

    inferCoord = (x: number, y: number, chessBoard: ChessBoard) => {
        // console.log("actual mouse coordinates: " + x + ", " + y)
        /*
            Should give the closest estimate for new position. 
        */
        const hashmap = new Map<number, number[]>();
        let shortestDistance = Infinity;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const canvasCoord = chessBoard[i][j].getCanvasCoord();
                // calculate distance
                const delta_x = canvasCoord[0] - x;
                const delta_y = canvasCoord[1] - y;
                const newDistance = Math.sqrt(delta_x ** 2 + delta_y ** 2);
                hashmap.set(newDistance, canvasCoord);

                if (newDistance < shortestDistance) {
                    shortestDistance = newDistance;
                }
            }
        }

        return hashmap.get(shortestDistance);
    };

    movePiece = (
        selectedId: string,
        finalPosition: number[],
        currentGame: Game,
        isMyMove: boolean
    ) => {
        /**
         * "update" is the connection between the model and the UI.
         * This could also be an HTTP request and the "update" could be the server response.
         * (model is hosted on the server instead of the browser)
         */
        let whiteKingInCheck = false;
        let blackKingInCheck = false;
        let blackCheckmated = false;
        let whiteCheckmated = false;
        const update = currentGame.movePiece(
            selectedId,
            finalPosition,
            isMyMove
        );

        if (update === "moved in the same position.") {
            this.revertToPreviousState(selectedId); // pass in selected ID to identify the piece that messed up
            return;
        } else if (update === "user tried to capture their own piece") {
            this.revertToPreviousState(selectedId);
            return;
        } else if (update === "b is in check" || update === "w is in check") {
            // change the fill of the enemy king or your king based on which side is in check.
            // play a sound or something
            if (update[0] === "b") {
                blackKingInCheck = true;
            } else {
                whiteKingInCheck = true;
            }
        } else if (
            update === "b has been checkmated" ||
            update === "w has been checkmated"
        ) {
            if (update[0] === "b") {
                blackCheckmated = true;
            } else {
                whiteCheckmated = true;
            }
        } else if (update === "invalid move") {
            this.revertToPreviousState(selectedId);
            return;
        }

        // let the server and the other client know your move
        if (isMyMove) {
            socket.emit(Events.NEW_MOVE, {
                nextPlayerColorToMove:
                    !this.state.gameState.thisPlayersColorIsWhite,
                playerColorThatJustMovedIsWhite:
                    this.state.gameState.thisPlayersColorIsWhite,
                selectedId: selectedId,
                finalPosition: finalPosition,
                gameId: this.props.gameId,
            });
        }

        if (this.props.playAudio !== undefined) {
            this.props.playAudio();
        }

        // sets the new game state.
        this.setState({
            draggedPieceTargetId: "",
            gameState: currentGame,
            playerTurnToMoveIsWhite: !this.props.color,
            whiteKingInCheck: whiteKingInCheck,
            blackKingInCheck: blackKingInCheck,
        });

        if (blackCheckmated) {
            alert("WHITE WON BY CHECKMATE!");
        } else if (whiteCheckmated) {
            alert("BLACK WON BY CHECKMATE!");
        }
    };

    revertToPreviousState = (selectedId: string) => {
        const { gameState } = this.state;

        // Revert to previous position
        gameState.revertToPreviousPosition(selectedId);

        // Update the state
        this.setState({
            gameState,
            draggedPieceTargetId: "",
        });
    };

    render() {
        //  console.log("it's white's move this time: " + this.state.playerTurnToMoveIsWhite)
        /*
            Look at the current game state in the model and populate the UI accordingly
        */
        // console.log(this.state.gameState.getBoard())

        return (
            <React.Fragment>
                <div
                    style={{
                        backgroundImage: `url(${Board})`,
                        width: "720px",
                        height: "720px",
                    }}
                >
                    <Stage width={720} height={720}>
                        <Layer>
                            {this.state.gameState.getBoard().map((row) => {
                                return (
                                    <React.Fragment>
                                        {row.map((square) => {
                                            if (square.isOccupied()) {
                                                return (
                                                    <Piece
                                                        key={square.getPieceIdOnThisSquare()}
                                                        x={square.getCanvasCoord()[0]}
                                                        y={square.getCanvasCoord()[1]}
                                                        imageURLs={piecemap[square.getPiece().name]}

                                                        isWhite={square.getPiece().color === "white"}

                                                        draggedPieceTargetId={this.state.draggedPieceTargetId}

                                                        onDragStart={this.startDragging}
                                                        onDragEnd={this.endDragging}
                                                        id={square.getPieceIdOnThisSquare()}

                                                        thisPlayersColorIsWhite={this.props.color}
                                                        playerTurnToMoveIsWhite={this.state.playerTurnToMoveIsWhite}

                                                        whiteKingInCheck={this.state.whiteKingInCheck}
                                                        blackKingInCheck={this.state.blackKingInCheck}
                                                    />
                                                );
                                            }
                                            return;
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </Layer>
                    </Stage>
                </div>
            </React.Fragment>
        );
    }
}

export default ChessGame;
