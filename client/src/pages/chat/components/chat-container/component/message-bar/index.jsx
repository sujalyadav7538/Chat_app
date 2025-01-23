/* eslint-disable no-unused-vars */
import { GrAttachment } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { userStore } from "@/store";
import { useSocket } from "@/context/SocketContext.jsx";

export const Messagebar = () => {
  const emojiRef = useRef(null); // Ref for emoji picker
  const inputRef = useRef(null); // Ref for input field
  const [message, setMessage] = useState(""); // Message input state
  const [emojiPickerState, setEmojiPickerState] = useState(false); // Emoji picker visibility
  const { selectedChatType, selectedChatData, userinfo } = userStore(); // Zustand store
  const socket = useSocket(); // Socket instance

  // Handle emoji selection
  const handleEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
    inputRef.current.focus(); // Focus back to input field
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleEmojiClose = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerState(false);
      }
    };
    document.addEventListener("mousedown", handleEmojiClose);
    return () => document.removeEventListener("mousedown", handleEmojiClose);
  }, []);

  // Send message
  const handleSendMessage = () => {
    if (!message.trim()) return; // Prevent sending empty messages
    if (!userinfo || !selectedChatData || !socket) return; // Check necessary states and socket

    const payload = {
      sender: userinfo._id,
      content: message.trim(),
      recipient: selectedChatData._id,
      messageType: "text",
      fileUrl: undefined,
    };

    socket.emit("sendmessage", payload); // Emit message to socket server
    setMessage(""); // Clear message input
    setEmojiPickerState(false); // Close emoji picker
  };

  // Handle Enter key for sending messages or line break with Shift
  const handleKeyDown = (e) => {
    if(e.key==='Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      {/* Input and attachments */}
      <div className="flex flex-1 rounded-md items-center gap-5 pr-5 bg-[#2a2b33]">
        <textarea
          ref={inputRef}
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none resize-none" // Use textarea for multi-line input
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Send message on Enter
        />
        {/* Attachment button */}
        <button
          className="text-neutral-500 hover:text-white duration-300 transition-all"
          title="Attach a file"
        >
          <GrAttachment className="text-3xl" />
        </button>
        {/* Emoji picker */}
        <div className="relative" ref={emojiRef}>
          <button
            className="text-neutral-500 hover:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerState((prev) => !prev)}
            title="Insert emoji"
          >
            <RiEmojiStickerLine className="text-3xl" />
          </button>
          {emojiPickerState && (
            <div className="absolute bottom-16 right-0 z-10">
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Send button */}
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] duration-300 transition-all"
        onClick={handleSendMessage}
        title="Send message"
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};
