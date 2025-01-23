import { Server as SocketIoServer } from "socket.io";
import Message from "./modals/MessageModal.js";

const setUpSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Map to track userId -> socketId
  const userSocketMap = new Map();

  // Helper function to emit a message to specific sockets
  const emitMessageToSockets = (messageData, senderSocketId, recipientSocketId) => {
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receivemessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receivemessage", messageData);
    }
  };

  // Disconnect handler
  const disconnect = (userId) => {
    if (userId && userSocketMap.has(userId)) {
      console.log(`Client disconnected: User ID ${userId}`);
      userSocketMap.delete(userId);
    } else {
      console.log(`Disconnect event: User ID ${userId} not found in map`);
    }
  };

  // Send message handler
  const sendMessage = async (message) => {
    try {
      console.log("Processing message...");

      // Fetch sender and recipient socket IDs
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      // Add a timestamp to the message
      const timestamp = new Date();
      const messageWithTimestamp = { ...message, timestamp };

      // Save message to the database
      const createdMessage = await Message.create(messageWithTimestamp);

      // Populate sender and recipient details
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id firstName lastName email image color")
        .populate("recipient", "id firstName lastName email image color");

      console.log("Message saved and populated:", messageData);

      // Emit the message to sender and recipient
      emitMessageToSockets(messageData, senderSocketId, recipientSocketId);
    } catch (error) {
      console.error("Error while sending message:", error.message);
    }
  };

  // Handle new socket connections
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: User ID ${userId}, Socket ID ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
      return;
    }

    // Listen for messages from the client
    socket.on("sendmessage", (message) => {
      console.log(`Received message from User ID ${userId}:`, message);
      sendMessage(message);
    });

    // Handle socket disconnection
    socket.on("disconnect", () => disconnect(userId));
  });

  console.log("Socket.IO server is set up and running.");
};

export default setUpSocket;
