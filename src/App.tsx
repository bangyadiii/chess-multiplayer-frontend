import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";

function App() {
    const [Message, setMessage] = useState(() => {
        const a: string | null = null;
        return a;
    });
    const socket = io("http://localhost:7777/");

    useEffect(() => {
        // Event listener untuk menangani peristiwa-peristiwa
        socket.on("connect", () => {
            const engine = socket.io.engine;

            console.log(
                "Koneksi WebSocket berhasil terbentuk: ",
                socket.connected
            );
            engine.once("upgrade", () => {
                // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
                console.log(engine.transport.name); // in most cases, prints "websocket"
            });
        });

        socket.on("msg", (data: unknown) => {
            console.log("Pesan diterima dari server:", data);
            setMessage(Message);
        });

        socket.on("error", (error: unknown) => {
            console.log("Terjadi kesalahan pada koneksi WebSocket:", error);
        });

        // Mengirim pesan ke server
        socket.emit(
            "msg",
            "Halo, server! Ini pesan dari klien.",
            function (data: unknown) {
                console.log(data);
            }
        );

        // Membersihkan koneksi ketika komponen unmount
        return () => {
            socket.disconnect();
        };
    }, [Message]);

    socket.on("disconnect", (reason) => {
        console.log("Koneksi WebSocket ditutup:", reason);
    });

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <p>Connect to socket io {Message}</p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
