import React, { RefObject } from "react";
import JoinGame from "./join_game";
import { TextField, Typography, colors } from "@mui/material";
import ChessGameWrapper from "../chess/ui/chess_game_wrapper";

interface JoinRoomState {
    didGetUserName: boolean;
    inputText: string;
}

class JoinRoom extends React.Component<object, JoinRoomState> {
    private textArea: RefObject<HTMLInputElement>;

    constructor(props: object) {
        super(props);
        this.textArea = React.createRef();
        this.state = {
            didGetUserName: false,
            inputText: "",
        };
    }

    typingUserName = () => {
        const typedText = this.textArea.current?.value || "";
        this.setState({
            inputText: typedText,
        });
    };

    render() {
        return (
            <React.Fragment>
                <h1
                    style={{
                        backgroundColor: "indigo",
                        color: "whitesmoke",
                    }}
                >
                    Joining the Game
                </h1>
                {this.state.didGetUserName ? (
                    <React.Fragment>
                        <JoinGame
                            userName={this.state.inputText}
                            isCreator={false}
                        />
                        <ChessGameWrapper myUserName={this.state.inputText} />
                    </React.Fragment>
                ) : (
                    <div>
                        <Typography variant="h4">Your Username:</Typography>
                        <TextField
                            label="Username"
                            variant="standard"
                            inputRef={this.textArea}
                            onInput={this.typingUserName}
                        />
                        <button
                            disabled={!(this.state.inputText.length > 0)}
                            onClick={() => {
                                this.setState({
                                    didGetUserName: true,
                                });
                            }}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default JoinRoom;
