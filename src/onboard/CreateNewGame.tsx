import { useContext, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { EventsType } from "../util/socketIO/events";
import { Button, Input } from "react-daisyui";
import { SocketContext } from "../context/SocketContext";

interface CreateNewGameState {
    didGetUserName: boolean;
    inputText: string;
    gameId: string;
}

interface CreateNewGameProps {
    setThisPlayerAsWhite: () => void;
    setUserName: (userName: string) => void;
}

const CreateNewGame: React.FC<CreateNewGameProps> = ({
    setThisPlayerAsWhite,
    setUserName,
}) => {
    const socket = useContext(SocketContext);

    const textArea = useRef<HTMLInputElement>(null);
    const [state, setState] = useState<CreateNewGameState>({
        didGetUserName: false,
        inputText: "",
        gameId: "",
    });

    const sendNewGameRequest = () => {
        const newGameRoomId = "gameId-" + uuid();
        setState((prevState) => ({
            ...prevState,
            gameId: newGameRoomId,
        }));
        socket.emit(EventsType.CREATE_NEW_GAME, newGameRoomId);
    };

    const typingUserName = () => {
        const typedText = textArea.current?.value || "";
        setState((prevState) => ({
            ...prevState,
            inputText: typedText,
        }));
    };

    const handleSubmitButton = () => {
        setThisPlayerAsWhite();
        setUserName(state.inputText);
        setState((prevState) => ({
            ...prevState,
            didGetUserName: true,
        }));
        sendNewGameRequest();
    };

    return (
        <>
            {state.didGetUserName ? (
                <Link to={"/game/" + state.gameId}>
                    <Button>Start Game</Button>
                </Link>
            ) : (
                <div>
                    <h4>Your Username:</h4>
                    <div>
                        <Input ref={textArea} onInput={typingUserName} />
                    </div>
                    <Button
                        disabled={!(state.inputText.length > 0)}
                        onClick={handleSubmitButton}
                    >
                        Submit
                    </Button>
                </div>
            )}
        </>
    );
};

export default CreateNewGame;
