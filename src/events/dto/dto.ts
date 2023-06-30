import { Move } from "chess.js";

export interface NewMoveDTO {
    move: Move;
    board: string; // chess.js fen format
    gameId: string;
}

export interface JoinGameDTO {
    gameId: string;
    userName: string;
    isCreator: boolean;
    socketId?: string;
}

export interface StatusJoinDTO {
    successToJoin: boolean;
    reason?: string;
    data?: {
        myUsername: string;
        opponentUsername: string;
    };
}

export interface JoinGameRequestDTO {
    gameId: string;
    isCreator: boolean;
    userName: string;
}
