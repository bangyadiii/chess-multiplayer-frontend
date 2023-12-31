import React, { RefObject } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../connection/socket";
import { Link, Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import { Events } from "../connection/events";

interface CreateNewGameState {
    didGetUserName: boolean;
    inputText: string;
    gameId: string;
}

interface CreateNewGameProps {
    setAsDidRedirect: () => void;
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
        const newGameRoomId = "GAMEID-" + uuid();
        this.setState({
            gameId: newGameRoomId,
        });
        socket.emit(Events.CREATE_NEW_GAME, newGameRoomId);
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
        this.props.setAsDidRedirect();
        this.props.setUserName(this.state.inputText);
        this.setState({
            didGetUserName: true,
        });
        this.sendNewGameRequest();
    };

    render() {
        return (
            <React.Fragment>
                <div>
                    {this.state.didGetUserName ? (
                        <Link to={"/game/" + this.state.gameId}>
                            <Button>Start Game</Button>
                        </Link>
                    ) : (
                        <div>
                            <h5>Your Username:</h5>

                            <div>
                                <TextField
                                    label="Username"
                                    variant="standard"
                                    inputRef={this.textArea}
                                    onInput={this.typingUserName}
                                    sx={{
                                        marginBottom: "10px",
                                    }}
                                />
                            </div>
                            <Button
                                color="primary"
                                variant="contained"
                                disabled={!(this.state.inputText.length > 0)}
                                onClick={this.handleSubmitButton}
                            >
                                Submit
                            </Button>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default CreateNewGame;
