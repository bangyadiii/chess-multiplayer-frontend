import React, { RefObject } from "react";
import JoinGame from "./JoinGame";
import ChessGameWrapper from "../chess/ui/ChessByGameId";

interface JoinRoomState {
    usernameIsEmpty: boolean;
    inputUsername: string;
}

class JoinRoom extends React.Component<object, JoinRoomState> {
    private textArea: RefObject<HTMLInputElement>;

    constructor(props: object) {
        super(props);
        this.textArea = React.createRef();
        this.state = {
            usernameIsEmpty: true,
            inputUsername: "",
        };
    }

    typingUserName = () => {
        const typedText = this.textArea.current?.value || "";
        this.setState({
            inputUsername: typedText,
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
                {!this.state.usernameIsEmpty ? (
                    <React.Fragment>
                        <JoinGame
                            userName={this.state.inputUsername}
                            isCreator={false}
                        />
                        <ChessGameWrapper
                            myUserName={this.state.inputUsername}
                        />
                    </React.Fragment>
                ) : (
                    <div>
                        <h4>Your Username:</h4>
                        <input
                            type="text"
                            ref={this.textArea}
                            onInput={this.typingUserName}
                        />
                        <button
                            disabled={!(this.state.inputUsername.length > 0)}
                            onClick={() => {
                                this.setState({
                                    usernameIsEmpty: false,
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
