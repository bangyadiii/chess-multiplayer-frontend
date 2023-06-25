import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

interface PieceProps {
    isWhite: boolean;
    imgurls: string[];
    id: string;
    draggedPieceTargetId: string;
    thisPlayersColorIsWhite: boolean;
    playerTurnToMoveIsWhite: boolean;
    whiteKingInCheck: boolean;
    blackKingInCheck: boolean;
    x: number;
    y: number;
    onDragStart: (event: any) => void;
    onDragEnd: (event: any) => void;
}

const Piece: React.FC<PieceProps> = (props) => {
    const choiceOfColor = props.isWhite ? 0 : 1;
    const [image] = useImage(props.imgurls[choiceOfColor]);
    const isDragged = props.id === props.draggedPieceTargetId;

    const canThisPieceEvenBeMovedByThisPlayer =
        props.isWhite === props.thisPlayersColorIsWhite;
    const isItThatPlayersTurn =
        props.playerTurnToMoveIsWhite === props.thisPlayersColorIsWhite;

    const thisWhiteKingInCheck = props.id === "wk1" && props.whiteKingInCheck;
    const thisBlackKingInCheck = props.id === "bk1" && props.blackKingInCheck;

    function isKingInCheck() {
        if (thisWhiteKingInCheck || thisBlackKingInCheck) {
            return "red";
        }
        return "";
    }

    return (
        <Image
            image={image}
            x={props.x - 90}
            y={props.y - 90}
            draggable={
                canThisPieceEvenBeMovedByThisPlayer && isItThatPlayersTurn
            }
            width={isDragged ? 75 : 60}
            height={isDragged ? 75 : 60}
            onDragStart={props.onDragStart}
            onDragEnd={props.onDragEnd}
            fill={isKingInCheck()}
            id={props.id}
        />
    );
};

export default Piece;
