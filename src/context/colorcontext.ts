/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

export const ColorContext = createContext({
    value: "",
    didRedirect: false,
    playerDidRedirect: () => {},
    playerDidNotRedirect: () => {},
});
