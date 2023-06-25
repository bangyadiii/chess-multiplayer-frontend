import Square from "./square"

export class ChessPiece {
    public name: string
    public isAttacked: boolean
    public color: string
    public  id: string
    public pieceOnCurrentSquare?: Square
    
    constructor(payload: {name: string, isAttacked: boolean, color: string, id: string}) {
        this.name = payload.name
        this.isAttacked = payload.isAttacked
        this.color = payload.color
        this.id = payload.id
    }
    /**
     *  Set the square this piece is sitting top of. 
     *  on any given piece (on the board), there will always be a piece on top of it.
     *  
     * @param newSquare: Square | undefined
     * @return void
     */
    public setSquare(newSquare?: Square): void {
        if (newSquare === undefined)  {
            this.pieceOnCurrentSquare = undefined
            return
        }

        if (this.pieceOnCurrentSquare === undefined) {
            this.pieceOnCurrentSquare = newSquare
            newSquare.setPiece(this)
        }
        const isNewSquareDifferent = this.pieceOnCurrentSquare.x !== newSquare.x || this.pieceOnCurrentSquare.y != newSquare.y

        if (isNewSquareDifferent) {
            console.debug("set");
            this.pieceOnCurrentSquare = newSquare
            newSquare.setPiece(this)
        }
    }

    public getSquare(): Square | undefined {
        return this.pieceOnCurrentSquare
    }
}