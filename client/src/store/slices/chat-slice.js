/* eslint-disable no-unused-vars */
export const createChatSlice = (set, get) => ({
    selectedChatType: "", // Type of chat (contact/channel)
    selectedChatData: "", // Data of the selected chat (user or channel)
    selectedChatMessage: [], // Array of messages in the current chat
  
    // Setters for managing chat state
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessage: (selectedChatMessage) => set({ selectedChatMessage }),
  
    // Function to close chat and reset state
    closeChat: () => {
      set({
        selectedChatType: "",
        selectedChatData: "",
        selectedChatMessage: [],
      });
    },
  
    // Function to add a message to the selectedChatMessage array
    addMessage: (message) => {
      const { selectedChatMessage, selectedChatType, selectedChatData } = get();
  
      // Check if the message belongs to the selected chat based on selectedChatType
      if (
        (selectedChatType === "contact" && 
          (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) ||
        (selectedChatType === "channel" && selectedChatData._id === message.channel._id)
      ) {
        // Append the new message to the existing array
        set({
          selectedChatMessage: [
            ...selectedChatMessage,
            {
              ...message,
              recipient:
                selectedChatType === "channel" ? message.recipient : message.recipient?._id,
              sender: selectedChatType === "channel" ? message.sender : message.sender?._id,
              timestamp: message.timestamp || new Date().toISOString(), // Add timestamp
            },
          ],
        });
      }
    },
  });
  