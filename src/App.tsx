import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import JoinRoom from "./onboard/join_room";
import { ColorContext } from "./context/color_context";
import Onboard from "./onboard/on_board";
import JoinGame from "./onboard/join_game";
import ChessGameWrapper from "./chess/ui/chess_game_wrapper";
/*
 *  Frontend flow:
 *
 * 1. user first opens this app in the browser.
 * 2. a screen appears asking the user to send their friend their game URL to start the game.
 * 3. the user sends their friend their game URL
 * 4. the user clicks the 'start' button and waits for the other player to join.
 * 5. As soon as the other player joins, the game starts.
 *
 *
 * Other player flow:
 * 1. user gets the link sent by their friend
 * 2. user clicks on the link and it redirects to their game. If the 'host' has not yet
 *    clicked the 'start' button yet, the user will wait for when the host clicks the start button.
 *    If the host decides to leave before they click on the "start" button, the user will be notified
 *    that the host has ended the session.
 * 3. Once the host clicks the start button or the start button was already clicked on
 *    before, that's when the game starts.
 * Onboarding screen =====> Game start.
 *
 * Every time a user opens our site from the '/' path, a new game instance is automatically created
 * on the back-end. We should generate the uuid on the frontend, send the request with the uuid
 * as a part of the body of the request. If any player leaves, then the other player wins automatically.
 *
 */

function App() {
    const [didRedirect, setDidRedirect] = React.useState(false);

    const playerDidRedirect = React.useCallback(() => {
        setDidRedirect(true);
    }, []);

    const playerDidNotRedirect = React.useCallback(() => {
        setDidRedirect(false);
    }, []);

    const [userName, setUserName] = React.useState("");

    const handleLandingPage = () => {
        if (didRedirect) {
            return (
                <React.Fragment>
                    <JoinGame userName={userName} isCreator={true} />
                    <ChessGameWrapper myUserName={userName} />
                </React.Fragment>
            );
        }

        return <JoinRoom />;
    };

    return (
        <ColorContext.Provider
            value={{
                didRedirect: didRedirect,
                playerDidRedirect: playerDidRedirect,
                playerDidNotRedirect: playerDidNotRedirect,
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Onboard setUserName={setUserName} />}
                    />
                    <Route path="/game/:gameid" element={handleLandingPage()} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ColorContext.Provider>
    );
}

export default App;
