import { ChessPiece } from "./piece"

class Square {
    public x: number
    public y: number
    public pieceOnThisSquare: ChessPiece | null
    public canvasCoord: number[]

    constructor(payload: {x: number, y: number, pieaceOnThisSquare: ChessPiece | null, canvasCoord: number[]}) {
        this.x = payload.x
        this.y = payload.y
        this.canvasCoord = payload.canvasCoord
        this.pieceOnThisSquare = payload.pieaceOnThisSquare
    }

    public setPiece(newPiece: ChessPiece | null) {
        if (newPiece === null && this.pieceOnThisSquare === null) {
            return
        }else if (newPiece === null && this.pieceOnThisSquare !== null){ 
            this.pieceOnThisSquare.setSquare(undefined)
            this.pieceOnThisSquare = null
        }else if (this.pieceOnThisSquare === null && newPiece !== null) {
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        } else if (newPiece !== null && this.getPieceIdOnThisSquare() !== newPiece.id && this.pieceOnThisSquare!.color != newPiece.color){
            // case where the funciton caller wants to changes the piece on this square. (only different color allowed, hitting opponents)
            console.debug("capture!");
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        }else {
            return "user tried to capture their own piece"
        }
    }

    public removePiece(){
        this.pieceOnThisSquare = null
    }

    public getPiece(): ChessPiece | null {
        return this.pieceOnThisSquare
    }

    public getPieceIdOnThisSquare() {
        if (this.pieceOnThisSquare === null){
            return "empty"
        }
        return this.pieceOnThisSquare.id
    }

    public isOccupied(): boolean {
        return this.pieceOnThisSquare != null
    }

    public getCoord() {
        return [this.x, this.y]
    }

    public getCanvasCoord(): number[] {
        return this.canvasCoord
    }
}

export default Square