/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

export const PlayerColorContext = createContext({
    thisPlayerIsWhite: false,
    setThisPlayerToWhite: () => {},
    setThisPlayerToBlack: () => {},
});
