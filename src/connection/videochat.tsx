import React, {
    useEffect,
    useState,
    useRef,
    ReactNode,
} from "react";
import { socket as currentSocket } from "./socket";
import Peer, { SignalData } from "simple-peer";
import { Socket } from "socket.io-client";

interface VideoChatAppProps {
    myUserName?: string;
    opponentUserName?: string;
    color?: string;
    mySocketId?: string;
    opponentSocketId: string;
}

interface ContainerProps {
    children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return <div className="h-screen w-full flex flex-col">{children}</div>;
};

interface RowProps {
    children: ReactNode;
}

const Row: React.FC<RowProps> = ({ children }) => {
    return <div className="w-full">{children}</div>;
};

const Video: React.FC<any> = ({ src }) => {
    return <video className="border-2 border-blue-500" src={src} />;
};

function VideoChatApp(props: VideoChatAppProps) {
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState<SignalData | undefined>();
    const [callAccepted, setCallAccepted] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const userVideo = useRef<HTMLVideoElement>(null);
    const partnerVideo = useRef<HTMLVideoElement>(null);
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }
            });

        socket.current = currentSocket;
        socket.current.on(
            "hey",
            (data: { from: string; signal: SignalData }) => {
                setReceivingCall(true);
                setCaller(data.from);
                setCallerSignal(data.signal);
            }
        );

        return () => {
            if (socket.current) {
                socket.current.off("hey");
            }
        };
    }, []);

    function callPeer(id: string) {
        setIsCalling(true);
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            if (socket.current) {
                socket.current.emit("callUser", {
                    userToCall: id,
                    signalData: data,
                    from: props.mySocketId,
                });
            }
        });

        peer.on("stream", (stream) => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        if (socket.current) {
            socket.current.on("callAccepted", (signal) => {
                setCallAccepted(true);
                peer.signal(signal);
            });
        }
    }

    function acceptCall() {
        setCallAccepted(true);
        setIsCalling(false);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", (data) => {
            if (socket.current) {
                socket.current.emit("acceptCall", { signal: data, to: caller });
            }
        });

        peer.on("stream", (stream) => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        if (peer.signal && callerSignal) {
            peer.signal(callerSignal);
        }
    }

    let UserVideo: JSX.Element | null = null;
    if (stream) {
        UserVideo = (
            <Video
                playsInline
                muted
                ref={userVideo}
                autoPlay
                style={{ width: "50%", height: "50%" }}
            />
        );
    }

    let mainView: JSX.Element;
    if (callAccepted) {
        mainView = (
            <Video
                playsInline
                ref={partnerVideo}
                autoPlay
                style={{ width: "100%", height: "100%" }}
            />
        );
    } else if (receivingCall) {
        mainView = (
            <div>
                <h1>{props.opponentUserName} sedang menelepon Anda</h1>
                <button onClick={acceptCall}>
                    <h1>Terima</h1>
                </button>
            </div>
        );
    } else if (isCalling) {
        mainView = (
            <div>
                <h1>Menelepon {props.opponentUserName}...</h1>
            </div>
        );
    } else {
        mainView = (
            <button onClick={() => callPeer(props.opponentSocketId)}>
                <h1>Obrolan dengan teman Anda saat bermain!</h1>
            </button>
        );
    }

    return (
        <Container>
            <Row>
                {mainView}
                {UserVideo}
            </Row>
        </Container>
    );
}

export default VideoChatApp;
