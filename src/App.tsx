import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import JoinRoom from "./onboard/JoinRoom";
import { PlayerColorContext } from "./context/PlayerColorContext";
import Onboard from "./onboard/Onboard";
import JoinGame from "./onboard/JoinGame";
import ChessByGameId from "./components/views/ChessByGameId";
import ROUTES from "./routes";
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
    /**
     * first player = game creator
     * keterangan = Player who made the game will be the first player, and the player who got invited, will be second player
     *
     * First player = white
     * keterangan = Player who created the game, will plays as white (chess piece)
     */
    const [thisPlayerIsFirstPlayer, setThisPlayerIsFirstPlayer] =
        React.useState(false);

    const setThisPlayerToWhite = React.useCallback(() => {
        setThisPlayerIsFirstPlayer(true);
    }, []);

    const setThisPlayerToBlack = React.useCallback(() => {
        setThisPlayerIsFirstPlayer(false);
    }, []);

    const [userName, setUserName] = React.useState("");

    const handleLandingPage = () => {
        if (thisPlayerIsFirstPlayer) {
            return (
                <React.Fragment>
                    <JoinGame userName={userName} isCreator={true} />
                    <ChessByGameId myUserName={userName} />
                </React.Fragment>
            );
        }

        return <JoinRoom />;
    };

    return (
        <PlayerColorContext.Provider
            value={{
                thisPlayerIsWhite: thisPlayerIsFirstPlayer, // first player (player who made the game) is always white
                setThisPlayerToWhite: setThisPlayerToWhite,
                setThisPlayerToBlack: setThisPlayerToBlack,
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route
                        path={ROUTES.home}
                        element={<Onboard setUserName={setUserName} />}
                    />
                    <Route path="/game/:gameid" element={handleLandingPage()} />
                    <Route
                        path={ROUTES["*"]}
                        element={<Navigate to="/" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </PlayerColorContext.Provider>
    );
}

export default App;
