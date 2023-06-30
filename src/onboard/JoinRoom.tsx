import React, { RefObject } from "react";
import JoinGame from "./JoinGame";
import ChessByGameId from "../components/views/ChessByGameId";
import { Button, Input } from "react-daisyui";

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
                {this.state.usernameIsEmpty ? (
                    <div>
                        <h4>Your Username:</h4>
                        <Input
                            type="text"
                            ref={this.textArea}
                            onInput={this.typingUserName}
                        />
                        <Button
                            variant="outline"
                            disabled={!(this.state.inputUsername.length > 0)}
                            onClick={() => {
                                this.setState({
                                    usernameIsEmpty: false,
                                });
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                ) : (
                    <React.Fragment>
                        <JoinGame
                            userName={this.state.inputUsername}
                            isCreator={false}
                        />
                        <ChessByGameId myUserName={this.state.inputUsername} />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

export default JoinRoom;
