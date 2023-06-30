import React, { RefObject } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../connection/socket";
import { Link, Navigate } from "react-router-dom";
import { EventsType } from "../util/socketIO/events";
import { Button, Input } from "react-daisyui";

interface CreateNewGameState {
    didGetUserName: boolean;
    inputText: string;
    gameId: string;
}

interface CreateNewGameProps {
    setThisPlayerAsWhite: () => void;
    setUserName: (userName: string) => void;
}

/**
 * Onboard is where we create the game room.
 */
class CreateNewGame extends React.Component<
    CreateNewGameProps,
    CreateNewGameState
> {
    private textArea: RefObject<HTMLInputElement>;

    constructor(props: CreateNewGameProps) {
        super(props);
        this.textArea = React.createRef();
        this.state = {
            didGetUserName: false,
            inputText: "",
            gameId: "",
        };
    }

    private sendNewGameRequest = () => {
        const newGameRoomId = "gameId-" + uuid();
        this.setState({
            gameId: newGameRoomId,
        });
        socket.emit(EventsType.CREATE_NEW_GAME, newGameRoomId);
    };

    private typingUserName = () => {
        const typedText = this.textArea.current?.value || "";
        this.setState({
            inputText: typedText,
        });
    };

    // When the 'Submit' button gets pressed from the username screen,
    // We should send a request to the server to create a new room with
    // the uuid we generate here.
    private handleSubmitButton = () => {
        this.props.setThisPlayerAsWhite();
        this.props.setUserName(this.state.inputText);
        this.setState({
            didGetUserName: true,
        });
        this.sendNewGameRequest();
    };

    render() {
        return (
            <React.Fragment>
                {this.state.didGetUserName ? (
                    <Link to={"/game/" + this.state.gameId}>
                        <Button>Start Game</Button>
                    </Link>
                ) : (
                    <div>
                        <h4 className="text-orange-700">Your Username:</h4>

                        <div>
                            <Input
                                ref={this.textArea}
                                onInput={this.typingUserName}
                            />
                        </div>
                        <Button
                            disabled={!(this.state.inputText.length > 0)}
                            onClick={this.handleSubmitButton}
                        >
                            Submit
                        </Button>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default CreateNewGame;
