/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import { userStore } from "@/store";

export const MessageContainer = () => {
  const { selectedChatMessage, userinfo } = userStore(); 

  return (
    <div className="flex-1 overflow-y-auto p-4 px-8 md:w-full bg-[#1e1e2a]">
      {selectedChatMessage.map((chat) => {
        const isUserMessage = chat.sender === userinfo._id; // Determine if the message was sent by the user
        return (
          <div
            key={chat._id} // Using _id to avoid potential issues with undefined 'id'
            className={`flex ${isUserMessage ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                isUserMessage
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-700 text-gray-200 rounded-bl-none"
              } shadow-md`}
              style={{
                wordBreak: "break-word", // Ensure text doesn't overflow
                whiteSpace: "pre-wrap", // Allow wrapping of long messages
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <p className="text-sm">{chat.content}</p>
                  <span className="text-xs text-gray-400 block mt-1">
                    {new Date(chat.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
