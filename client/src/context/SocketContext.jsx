/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { userStore } from "@/store";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null); // Persist socket instance
    const { userinfo, addMessage, selectedChatType, selectedChatData } = userStore();

    // Create refs to hold the latest values
    const selectedChatTypeRef = useRef(selectedChatType);
    const selectedChatDataRef = useRef(selectedChatData);

    // Update refs whenever state changes
    useEffect(() => {
        selectedChatTypeRef.current = selectedChatType;
        selectedChatDataRef.current = selectedChatData;
    }, [selectedChatType, selectedChatData]);

    useEffect(() => {
        if (userinfo) {
            // Initialize socket
            socket.current = io("http://localhost:8747/", {
                withCredentials: true,
                query: { userId: userinfo._id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server:", socket.current.id);
            });

            const handleReceiveMessage = (message) => {
                const currentChatType = selectedChatTypeRef.current;
                const currentChatData = selectedChatDataRef.current;

                console.log(currentChatType, currentChatData);
                if (
                    currentChatType &&
                    (currentChatData._id === message.sender._id ||
                        currentChatData._id === message.recipient._id)
                ) {
                    console.log("Message received:", message);
                    addMessage(message);
                }
            };

            socket.current.on("receivemessage", handleReceiveMessage);

            // Cleanup on component unmount
            return () => {
                if (socket.current) {
                    socket.current.off("receivemessage", handleReceiveMessage);
                    console.log("Disconnecting");
                    socket.current.disconnect();
                    socket.current = null;
                }
            };
        }
    }, [userinfo]); // Only re-run when `userinfo` changes

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
