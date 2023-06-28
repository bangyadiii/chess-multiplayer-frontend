import React from "react";
import { ColorContext } from "../context/color_context";
import CreateNewGame from "./create_new_game";

const Onboard = (props: { setUserName: (userName: string) => void }) => {
    const color = React.useContext(ColorContext);

    return (
        <CreateNewGame
            setAsDidRedirect={color.playerDidRedirect}
            setUserName={props.setUserName}
        />
    );
};

export default Onboard;
