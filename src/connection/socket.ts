import io from "socket.io-client"

const URL = "http://localhost:9999"

const socket = io(URL)

let mySocketId: string

socket.on('createNewGame', statusUpdate => {
    console.log("A new game has been created! Username: " + statusUpdate.userName, "GameId: ", statusUpdate.gameId);
    console.table(statusUpdate);

    mySocketId = statusUpdate.mySocketId
})

export {
    socket,
    mySocketId
}