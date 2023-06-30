import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Theme } from "react-daisyui";
import "./index.css";
import { AppSettings, SettingsProvider } from "./context/SettingContext.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

declare global {
    interface AppGlobal {
        SETTINGS_STORE_KEY: string;
        THEMES: ["light", "dark"];
    }

    interface Window {
        APP: AppGlobal;
    }
}

const defaultAppSettings: AppSettings = {
    dev: import.meta.env.DEV,
    theme: "dark",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <SettingsProvider value={{ defaultValues: defaultAppSettings }}>
        <Theme dataTheme={defaultAppSettings.theme}>
            <SocketProvider>
                <App />
            </SocketProvider>
        </Theme>
    </SettingsProvider>
    // </React.StrictMode>
);
