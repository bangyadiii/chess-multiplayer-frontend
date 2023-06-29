import React from "react";
import { PlayerColorContext } from "../context/color_context";
import CreateNewGame from "./CreateNewGame";

const Onboard = (props: { setUserName: (userName: string) => void }) => {
    const playerColorContext = React.useContext(PlayerColorContext);

    return (
        <CreateNewGame
            setThisPlayerAsWhite={playerColorContext.setThisPlayerToWhite}
            setUserName={props.setUserName}
        />
    );
};

export default Onboard;